# ElevenLabs to LiveKit+Custom Pipeline Migration Plan

Replace the bundled ElevenLabs solution (Conversational AI + TTS + STT) with a custom pipeline: LiveKit for real-time voice transport, cheap ASR, a small LLM, and low-latency TTS.

---

## Architecture Overview

### Current

```
Parts 1/2/4 (scripted):
  Client -> ElevenLabs TTS API -> expo-av playback
  Client -> expo-av recording -> ElevenLabs STT API
  (no real-time transport, just sequential HTTP calls)

Part 3 (conversational):
  Client -> ElevenLabs ConvAI WebSocket (bundles ASR+LLM+TTS)
  ElevenLabs -> voice-webhook edge function (transcript delivery)
```

### Target

```
Parts 1/2/4 (scripted):
  Client -> [New TTS provider] API -> expo-av playback
  Client -> expo-av recording -> [New STT provider] API
  (same pattern, different endpoints)

Part 3 (conversational):
  Client -> LiveKit Room (WebRTC, SDK already installed)
  LiveKit Agent (server-side process) orchestrates:
    User audio -> STT -> LLM -> TTS -> Agent audio
  Agent pushes transcript to Supabase when session ends
```

### What stays the same

- VAD (`voiceActivityDetection.ts`) - uses expo-av metering, provider-agnostic
- Audio playback (`playAudio` in elevenlabsTTS.ts) - uses expo-av
- Audio caching (`cache-audio` edge function) - uses Supabase storage
- Grading (`exam-grade` edge function) - consumes text transcripts, no voice dependency
- Exam session orchestrator (`app/exam/session/[id].tsx`) - renders components per part
- Transcript format - `role: message\nrole: message` stays identical
- Database schema - no changes needed

---

## Provider Selection

Evaluate before starting. Recommended starting points:

| Role | Provider | Why | Approx cost |
|------|----------|-----|-------------|
| STT | Deepgram Nova-2 | Low latency streaming, good accuracy, simple API | $0.0043/min |
| STT (alt) | Groq Whisper | Cheapest, fast, batch only (fine for Parts 1/2/4) | $0.02/hr |
| LLM | OpenRouter (Llama 3.1 8B or Gemini Flash) | OpenAI-compatible API, dirt cheap, fast | $0.06-0.075/1M tokens |
| TTS | Cartesia Sonic | Streaming support, low TTFB (~130ms), natural voice | $0.015/1K chars |
| TTS (alt) | Deepgram Aura | Cheapest, adequate quality | $0.0045/1K chars |
| Transport | LiveKit Cloud | Free tier (50 participant-hrs/mo), SDK already installed | Usage-based after free tier |

The LLM choice is flexible - any OpenAI-compatible endpoint works. The examiner role requires zero reasoning: follow a script, ask follow-ups, manage turn-taking. A 7-8B model is more than sufficient.

For TTS, streaming capability matters for Part 3 (conversational) but not for Parts 1/2/4 (pre-generate and play). Pick one provider that handles both or use two (cheap batch for scripted, streaming for conversational).

---

## Phase 1: Replace TTS and STT for Parts 1, 2, 4

**Effort: ~1-2 hours. Zero architecture changes.**

These parts use simple HTTP request-response patterns. No real-time streaming. No LiveKit involvement. Just swap the API endpoint.

### Step 1.1: Create provider-agnostic config

**New file: `src/features/voice/services/voiceConfig.ts`**

Replace `elevenLabsConfig.ts`. Hold API keys and base URLs for the new providers.

```typescript
// API keys from env
export const STT_API_KEY = process.env.EXPO_PUBLIC_STT_API_KEY ?? '';
export const TTS_API_KEY = process.env.EXPO_PUBLIC_TTS_API_KEY ?? '';
export const TTS_VOICE_ID = process.env.EXPO_PUBLIC_TTS_VOICE_ID ?? '';
```

New env vars needed in `.env`:
```
EXPO_PUBLIC_STT_API_KEY=           # Deepgram or Groq key
EXPO_PUBLIC_TTS_API_KEY=           # Cartesia or Deepgram key
EXPO_PUBLIC_TTS_VOICE_ID=          # Voice ID for chosen TTS provider
```

### Step 1.2: Replace STT service

**Modify: `src/features/voice/services/elevenlabsSTT.ts`**

Rename to `sttService.ts`. Change the HTTP call from ElevenLabs to the new provider.

Current call:
```
POST https://api.elevenlabs.io/v1/speech-to-text
FormData: file (audio/mp4), model_id: 'scribe_v2'
Header: xi-api-key
```

Example replacement (Deepgram):
```
POST https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true
Body: raw audio bytes
Header: Authorization: Token {key}
```

Example replacement (Groq Whisper):
```
POST https://api.groq.com/openai/v1/audio/transcriptions
FormData: file, model: 'whisper-large-v3'
Header: Authorization: Bearer {key}
```

**Interface stays identical**: `speechToText(audioPath: string): Promise<{ text: string }>`.

No changes needed in `useScriptedExam.ts`, `useLongTurn.ts`, or `voiceActivityDetection.ts` - they just call `speechToText()` and get text back.

### Step 1.3: Replace TTS service

**Modify: `src/features/voice/services/elevenlabsTTS.ts`**

Rename to `ttsService.ts`. Change the HTTP call from ElevenLabs to the new provider.

Current call:
```
POST https://api.elevenlabs.io/v1/text-to-speech/{voiceId}
Header: xi-api-key
Body: JSON with text, model_id, voice_settings
Returns: audio/mpeg bytes
```

Example replacement (Cartesia):
```
POST https://api.cartesia.ai/tts/bytes
Header: X-API-Key, Cartesia-Version
Body: JSON with transcript, voice.id, output_format
Returns: audio bytes
```

Example replacement (OpenAI TTS):
```
POST https://api.openai.com/v1/audio/speech
Header: Authorization: Bearer {key}
Body: JSON with model: 'tts-1', voice, input
Returns: audio bytes
```

**Interface stays identical**: `textToSpeech({ text, voiceId? }): Promise<string>` returns a local file URI.

The `playAudio()` and `uploadToCache()` functions in the same file are provider-agnostic - no changes needed.

### Step 1.4: Update imports

All files that import from the old paths need updating:

| File | Old import | New import |
|------|-----------|------------|
| `useScriptedExam.ts` | `../services/elevenlabsTTS` | `../services/ttsService` |
| `useScriptedExam.ts` | `../services/elevenlabsSTT` | `../services/sttService` |
| `useLongTurn.ts` | `../services/elevenlabsTTS` | `../services/ttsService` |
| `useLongTurn.ts` | `../services/elevenlabsSTT` | `../services/sttService` |

### Step 1.5: Delete unused edge functions

`voice-tts` and `voice-stt` edge functions exist but are never called by the client (TTS/STT calls go directly from client to ElevenLabs). They can be deleted or left alone.

### Step 1.6: Validate

- Run Part 1 exam: questions should be narrated, answers transcribed
- Run Part 2 exam: prompt narrated, speech transcribed, follow-up works
- Run Part 4 exam: same as Part 1
- Audio caching still works (upload to Supabase storage)
- Grading still works (transcripts unchanged)

---

## Phase 2: Replace Part 3 Conversational AI with LiveKit Agent

**Effort: ~2-3 days. This is the substantial work.**

### Architecture

```
┌─────────────┐     WebRTC      ┌──────────────┐
│  iOS Client  │ ◄────────────► │ LiveKit Cloud │
│  (LiveKit    │                 │   (Room)      │
│   RN SDK)    │                 └──────┬───────┘
└─────────────┘                        │
                                       │ Worker connection
                                ┌──────┴───────┐
                                │ LiveKit Agent │
                                │  (Python)     │
                                │               │
                                │  STT ──► LLM ──► TTS
                                │  (Deepgram) (OpenRouter) (Cartesia)
                                │               │
                                │  On end: push transcript to Supabase
                                └───────────────┘
```

### Step 2.1: LiveKit Cloud setup

1. Create account at https://cloud.livekit.io
2. Create a project
3. Get: `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`
4. These go in Supabase edge function secrets (for token generation) and in the agent's environment

### Step 2.2: Replace `voice-agent-session` edge function

**Modify: `supabase/functions/voice-agent-session/index.ts`**

Currently: requests a signed URL from ElevenLabs ConvAI API.
New: generates a LiveKit room token and returns it with the room name.

Use the `livekit-server-sdk` (available for Deno/Node) to generate access tokens:

```typescript
import { AccessToken } from 'livekit-server-sdk';

// Generate a unique room name
const roomName = `exam-${level}-${userId}-${Date.now()}`;

// Create participant token for the client
const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
  identity: userId,
  metadata: JSON.stringify({
    level,
    contentPrompt: content.discussion_prompt,
    contentOptions: content.options,
    diagramMermaid: content.diagram_mermaid,
    decisionPrompt: content.decision_prompt,
  }),
});
token.addGrant({
  room: roomName,
  roomJoin: true,
  canPublish: true,
  canSubscribe: true,
});
```

**Response shape changes:**

```typescript
// Old response
{
  signedUrl: string;       // ElevenLabs WebSocket URL
  agentId: string;         // ElevenLabs agent ID
  sessionId: string;
  contentPrompt?: string;
  contentOptions?: string[];
  diagramMermaid?: string;
  decisionPrompt?: string;
}

// New response
{
  livekitUrl: string;      // LiveKit Cloud WebSocket URL
  token: string;           // LiveKit access token (JWT)
  roomName: string;        // Room identifier
  sessionId: string;       // Same as before
  contentPrompt?: string;  // Same
  contentOptions?: string[];
  diagramMermaid?: string;
  decisionPrompt?: string;
}
```

Update `voiceApi.ts` `AgentSession` interface and `getAgentSession()` to match.

New env vars for this edge function (Supabase secrets):
```
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=APIxxxxxxx
LIVEKIT_API_SECRET=xxxxxxxxxxxxxxx
```

### Step 2.3: Build the LiveKit Agent

**New component: standalone Python process (or Node, but Python has better LiveKit Agent SDK support)**

This is the server-side process that joins the LiveKit room as the "examiner" participant and orchestrates the voice pipeline.

**Directory: `agent/` in project root (or separate repo)**

```
agent/
  main.py           # Entry point
  examiner.py       # Agent logic (system prompt, turn management)
  requirements.txt  # Dependencies
  .env              # Agent-side secrets
  Dockerfile        # For deployment
```

**`requirements.txt`:**
```
livekit-agents>=1.0
livekit-plugins-deepgram>=1.0
livekit-plugins-openai>=1.0
livekit-plugins-cartesia>=1.0
supabase>=2.0
```

**`main.py` (core logic):**

```python
from livekit.agents import AutoSubscribe, JobContext, WorkerOptions, cli
from livekit.agents.voice import Agent, AgentSession
from livekit.plugins import deepgram, openai, cartesia
from supabase import create_client
import json
import os

supabase = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_SERVICE_ROLE_KEY"])

async def entrypoint(ctx: JobContext):
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    # Read exam content from room metadata (set by edge function via participant metadata)
    metadata = json.loads(ctx.room.metadata or "{}")
    level = metadata.get("level", "B2")
    content_prompt = metadata.get("contentPrompt", "")
    options = metadata.get("contentOptions", [])
    decision_prompt = metadata.get("decisionPrompt", "")
    session_id = metadata.get("sessionId", "")

    options_text = "\n".join(f"- {opt}" for opt in options)

    system_prompt = f"""You are a Cambridge English {level} Speaking Exam examiner conducting Part 3: the Collaborative Task.

TASK FOR THE CANDIDATE:
{content_prompt}

OPTIONS TO DISCUSS:
{options_text}

DECISION TASK (after discussion):
{decision_prompt}

INSTRUCTIONS:
- Speak naturally as a real examiner would
- Let the candidate lead the discussion
- Ask follow-up questions to encourage elaboration
- After discussing all options, ask the candidate to make a final decision
- Keep your responses concise (1-2 sentences typically)
- Do not over-explain or lecture
- The conversation should last about 4-5 minutes total
- When the candidate has made their decision and justified it, end the conversation naturally"""

    agent = Agent(
        stt=deepgram.STT(model="nova-2"),
        llm=openai.LLM(
            model="meta-llama/llama-3.1-8b-instruct",
            base_url="https://openrouter.ai/api/v1",
            api_key=os.environ["OPENROUTER_API_KEY"],
        ),
        tts=cartesia.TTS(
            model_id="sonic-2",
            voice="<chosen-voice-id>",
        ),
        instructions=system_prompt,
    )

    session = AgentSession()

    # Collect transcript
    transcript_lines = []

    @session.on("agent_speech_committed")
    def on_agent_speech(msg):
        transcript_lines.append(f"assistant: {msg.content}")

    @session.on("user_speech_committed")
    def on_user_speech(msg):
        transcript_lines.append(f"user: {msg.content}")

    await session.start(agent=agent, room=ctx.room)

    # When participant leaves, push transcript to Supabase
    @ctx.room.on("participant_disconnected")
    async def on_disconnect(participant):
        if participant.identity != ctx.room.local_participant.identity:
            transcript = "\n".join(transcript_lines)
            supabase.table("conversation_sessions").update({
                "transcript": transcript,
                "ended_at": "now()",
                "duration_seconds": len(transcript_lines) * 5,  # rough estimate
                "status": "completed",
            }).eq("id", session_id).execute()


if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            api_key=os.environ["LIVEKIT_API_KEY"],
            api_secret=os.environ["LIVEKIT_API_SECRET"],
            ws_url=os.environ["LIVEKIT_URL"],
        )
    )
```

**Agent env vars (`.env` for the agent process):**
```
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=APIxxxxxxx
LIVEKIT_API_SECRET=xxxxxxxxxxxxxxx
OPENROUTER_API_KEY=sk-or-...
DEEPGRAM_API_KEY=...
CARTESIA_API_KEY=...
SUPABASE_URL=https://jngxzbwwhowgwvcxytzn.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
```

**Hosting options for the agent:**
- Fly.io (simplest: `fly deploy` with Dockerfile, ~$5/mo for always-on)
- Railway (similar simplicity)
- Any VPS with Docker
- LiveKit's hosted agents (if available in your region)

The agent must be always-on (or scale-to-zero with fast cold start) because it needs to join rooms when participants connect.

### Step 2.4: Replace `useConversationalAI` hook

**Modify: `src/features/voice/hooks/useConversationalAI.ts`**

Replace the ElevenLabs `useConversation()` hook with LiveKit's React Native SDK.

The LiveKit RN SDK (`@livekit/react-native`) provides:
- `useRoom()` - room connection state
- `useParticipant()` - track individual participants
- `useTrackPublication()` - subscribe to audio tracks
- `Room` class for programmatic control

**Key changes:**

```typescript
import { Room, RoomEvent, Track } from 'livekit-client';

// Instead of:
// const conversation = useConversation({ onMessage, onConnect, onDisconnect });
// conversation.startSession({ signedUrl, dynamicVariables });

// Do:
const room = new Room();

async function startSession() {
  const { livekitUrl, token, roomName, sessionId, ...content } =
    await getAgentSession(level, part3ContentId);

  setDiagramMermaid(content.diagramMermaid);
  setContentOptions(content.contentOptions);

  room.on(RoomEvent.DataReceived, (payload, participant) => {
    // Agent sends transcript messages as data channel messages
    const msg = JSON.parse(new TextDecoder().decode(payload));
    addMessage(msg.role, msg.content);
  });

  room.on(RoomEvent.Disconnected, () => {
    const fullTranscript = messagesRef.current
      .map(m => `${m.role}: ${m.content}`)
      .join('\n');
    onSessionEnd?.(fullTranscript);
  });

  await room.connect(livekitUrl, token);
}

async function endSession() {
  await room.disconnect();
}
```

**Return shape stays identical** - same `status`, `isSpeaking`, `messages`, `startSession`, `endSession`, etc. The `ConversationScreen` component needs zero changes if the hook API is preserved.

**Note on transcript collection**: The LiveKit Agent collects the transcript server-side and pushes to Supabase. The client also builds a local copy from data channel messages for real-time UI updates. Both paths produce the same transcript.

### Step 2.5: Delete or repurpose `voice-webhook` edge function

The ElevenLabs webhook (`voice-webhook`) is no longer needed. The LiveKit Agent pushes transcripts directly to Supabase when the conversation ends.

Options:
- Delete the edge function entirely
- Or repurpose it as a LiveKit webhook receiver (LiveKit can send webhooks for room events) for redundancy

If using LiveKit webhooks as backup, the payload format is different from ElevenLabs but the update logic is the same: find the conversation_sessions row, update transcript + status.

### Step 2.6: Update `conversation_sessions` table

Minor schema consideration. Currently stores `agent_id` (ElevenLabs agent ID) and `conversation_id` (ElevenLabs conversation ID). After migration:

- `agent_id` -> store `room_name` (LiveKit room identifier) or keep as a generic agent identifier
- `conversation_id` -> store LiveKit `room_sid` (server-assigned room ID)

No migration needed - these are text fields. Just store different values.

### Step 2.7: Validate Part 3

- Start Part 3 exam session
- Client connects to LiveKit room
- Agent joins automatically (LiveKit dispatches to the running agent process)
- Real-time conversation works (user speaks, agent responds)
- Mermaid diagram and options display correctly
- Conversation ends naturally or via user action
- Transcript saved to conversation_sessions
- Grading works with the transcript

---

## Phase 3: Cleanup

**Effort: ~1 hour.**

### Step 3.1: Remove ElevenLabs dependencies

```sh
bun remove @elevenlabs/react-native
```

### Step 3.2: Remove ElevenLabs env vars

Delete from `.env` and `.env.example`:
```
EXPO_PUBLIC_ELEVENLABS_API_KEY
EXPO_PUBLIC_ELEVENLABS_VOICE_ID
EXPO_PUBLIC_ELEVENLABS_AGENT_ID_B2_PART3
EXPO_PUBLIC_ELEVENLABS_AGENT_ID_C1_PART3
EXPO_PUBLIC_ELEVENLABS_AGENT_ID_C2_PART3
```

Remove from Supabase edge function secrets:
```
ELEVENLABS_API_KEY
ELEVENLABS_VOICE_ID
ELEVENLABS_AGENT_ID_B2_PART3
ELEVENLABS_AGENT_ID_C1_PART3
ELEVENLABS_AGENT_ID_C2_PART3
```

### Step 3.3: Delete old files

- `src/features/voice/services/elevenLabsConfig.ts`
- `src/types/elevenlabs.ts`
- `supabase/functions/voice-tts/index.ts` (never used by client)
- `supabase/functions/voice-stt/index.ts` (never used by client)
- `supabase/functions/voice-webhook/index.ts` (replaced by agent-side push)

### Step 3.4: Rename files

- `elevenlabsTTS.ts` -> `ttsService.ts`
- `elevenlabsSTT.ts` -> `sttService.ts`

Update all imports.

---

## Environment Variables Summary

### Client-side (`.env`)

| Variable | Old (ElevenLabs) | New |
|----------|-----------------|-----|
| `EXPO_PUBLIC_ELEVENLABS_API_KEY` | ElevenLabs API key | DELETE |
| `EXPO_PUBLIC_ELEVENLABS_VOICE_ID` | Voice ID | DELETE |
| `EXPO_PUBLIC_ELEVENLABS_AGENT_ID_*` | Agent IDs x3 | DELETE |
| `EXPO_PUBLIC_STT_API_KEY` | - | NEW: Deepgram/Groq key |
| `EXPO_PUBLIC_TTS_API_KEY` | - | NEW: Cartesia/Deepgram key |
| `EXPO_PUBLIC_TTS_VOICE_ID` | - | NEW: Voice ID for TTS provider |

### Supabase edge function secrets

| Variable | Old | New |
|----------|-----|-----|
| `ELEVENLABS_API_KEY` | ElevenLabs key | DELETE |
| `ELEVENLABS_VOICE_ID` | Voice ID | DELETE |
| `ELEVENLABS_AGENT_ID_*` | Agent IDs x3 | DELETE |
| `LIVEKIT_URL` | - | NEW: LiveKit Cloud URL |
| `LIVEKIT_API_KEY` | - | NEW: LiveKit API key |
| `LIVEKIT_API_SECRET` | - | NEW: LiveKit API secret |

### Agent process (separate `.env`)

| Variable | Purpose |
|----------|---------|
| `LIVEKIT_URL` | LiveKit Cloud WebSocket URL |
| `LIVEKIT_API_KEY` | LiveKit API key |
| `LIVEKIT_API_SECRET` | LiveKit API secret |
| `OPENROUTER_API_KEY` | LLM provider |
| `DEEPGRAM_API_KEY` | STT provider |
| `CARTESIA_API_KEY` | TTS provider |
| `SUPABASE_URL` | For transcript storage |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin access for writes |

---

## Files Changed (Complete List)

### Modified

| File | What changes |
|------|-------------|
| `src/features/voice/services/elevenlabsTTS.ts` | Rename to `ttsService.ts`, swap API endpoint |
| `src/features/voice/services/elevenlabsSTT.ts` | Rename to `sttService.ts`, swap API endpoint |
| `src/features/voice/hooks/useConversationalAI.ts` | Replace ElevenLabs SDK with LiveKit Room connection |
| `src/features/voice/hooks/useScriptedExam.ts` | Update imports only |
| `src/features/voice/hooks/useLongTurn.ts` | Update imports only |
| `src/services/api/voiceApi.ts` | Update `AgentSession` interface (signedUrl -> livekitUrl+token) |
| `supabase/functions/voice-agent-session/index.ts` | Generate LiveKit token instead of ElevenLabs signed URL |
| `.env` / `.env.example` | Swap env vars |

### New

| File | Purpose |
|------|---------|
| `src/features/voice/services/voiceConfig.ts` | Provider-agnostic API key config |
| `agent/main.py` | LiveKit Agent process |
| `agent/requirements.txt` | Python dependencies |
| `agent/Dockerfile` | Agent deployment |
| `agent/.env.example` | Agent env var template |

### Deleted

| File | Why |
|------|-----|
| `src/features/voice/services/elevenLabsConfig.ts` | Replaced by voiceConfig.ts |
| `src/types/elevenlabs.ts` | No longer needed |
| `supabase/functions/voice-tts/index.ts` | Never used by client |
| `supabase/functions/voice-stt/index.ts` | Never used by client |
| `supabase/functions/voice-webhook/index.ts` | Replaced by agent-side transcript push |

### Unchanged

| File | Why unchanged |
|------|--------------|
| `src/features/voice/services/voiceActivityDetection.ts` | Uses expo-av, provider-agnostic |
| `src/components/exam/ConversationScreen.tsx` | Hook API preserved |
| `src/components/exam/Part2LongTurn.tsx` | Hook API preserved |
| `app/exam/session/[id].tsx` | Component API preserved |
| `supabase/functions/exam-grade/index.ts` | Consumes text transcripts only |
| `supabase/functions/cache-audio/index.ts` | Stores audio bytes, provider-agnostic |

---

## Execution Order

```
Phase 1 (TTS + STT swap)         ~1-2 hours
  1.1 Create voiceConfig.ts
  1.2 Swap STT endpoint
  1.3 Swap TTS endpoint
  1.4 Update imports
  1.5 Validate Parts 1, 2, 4

Phase 2 (Part 3 LiveKit Agent)   ~2-3 days
  2.1 LiveKit Cloud account setup
  2.2 Replace voice-agent-session edge function
  2.3 Build LiveKit Agent (Python)
  2.4 Deploy agent to Fly.io/Railway
  2.5 Replace useConversationalAI hook
  2.6 Remove voice-webhook
  2.7 Validate Part 3 end-to-end

Phase 3 (Cleanup)                ~1 hour
  3.1 Remove @elevenlabs/react-native
  3.2 Remove ElevenLabs env vars
  3.3 Delete dead files
  3.4 Rename files, update imports
```

Phases 1 and 2 are independent - Phase 1 can ship first while Phase 2 is in progress. Each phase is individually deployable.

---

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| TTS quality regression | Low | Test multiple providers, pick one that sounds natural for British English examiner |
| STT accuracy regression | Low | Deepgram Nova-2 and Groq Whisper are both excellent; test with accented English |
| Part 3 latency (agent response time) | Medium | Tune: use streaming TTS, pick fast LLM (Groq or OpenRouter with fast provider), use Deepgram streaming STT |
| LiveKit Agent cold start | Medium | Keep agent process always-on (not scale-to-zero) or use LiveKit's built-in agent dispatch |
| Agent hosting cost | Low | Minimal compute - a $5/mo Fly.io instance handles dozens of concurrent sessions |
| LiveKit free tier exhaustion | Low | 50 participant-hours/month is ~600 five-minute exams. Upgrade when needed |

---

## Cost Model (per exam session, ~15 minutes total)

| Component | ElevenLabs (current) | Custom pipeline |
|-----------|---------------------|-----------------|
| Part 3 conversation (5 min) | ~$0.50-1.00 | ~$0.05-0.10 |
| TTS: Parts 1, 2, 4 (~2K chars) | ~$0.03 | ~$0.01-0.03 |
| STT: Parts 1, 2, 4 (~5 min) | ~$0.05 | ~$0.01-0.03 |
| LiveKit transport | $0 (bundled) | ~$0.01 |
| Agent hosting (amortized) | $0 (bundled) | ~$0.01 |
| **Total per exam** | **~$0.60-1.10** | **~$0.09-0.18** |
| **At 1000 exams/month** | **~$600-1100** | **~$90-180** |
