# Mintzo - Cambridge Speaking Exam Practice App

## Complete Product & Development Plan

---

## 1. Product Overview

**App Name:** Mintzo
**Purpose:** AI-powered mobile app for practicing Cambridge English Speaking exams
**Target Users:** Students preparing for B2 First, C1 Advanced, and C2 Proficiency exams
**Platforms:** iOS and Android (React Native + Expo)

---

## 2. Cambridge Speaking Exam Reference

### 2.1 B2 First (FCE) Speaking Test

| Part | Name | Duration | Format |
|------|------|----------|--------|
| **Part 1** | Interview | 2 min | Examiner asks personal questions about experiences, circumstances, future plans |
| **Part 2** | Long Turn | 4 min | Two photographs with written prompt. Speak for 1 min, then 30-sec response to partner's photos |
| **Part 3** | Collaborative Task | 3 min | Written prompts + question. 2 min discussion + 1 min reaching decision together |
| **Part 4** | Discussion | 4 min | Examiner-led discussion expanding on Part 3 topics |

**Total Duration:** 14 minutes (pair of candidates)
**Examiners:** 2 (interlocutor + assessor)

### 2.2 C1 Advanced (CAE) Speaking Test

| Part | Name | Duration | Format |
|------|------|----------|--------|
| **Part 1** | Interview | 2 min | Personal information, interests, studies, career questions |
| **Part 2** | Long Turn | 4 min | THREE photographs (discuss TWO). 1 min speaking + 30-sec response |
| **Part 3** | Collaborative Task | 3 min | Written prompts leading to collaborative decision (2 min + 1 min) |
| **Part 4** | Discussion | 5 min | Extended discussion on Part 3 themes with examiner questions |

**Total Duration:** 15 minutes (pair) / 23 minutes (group of 3)
**Examiners:** 2 (interlocutor + assessor)

### 2.3 C2 Proficiency (CPE) Speaking Test

| Part | Name | Duration | Format |
|------|------|----------|--------|
| **Part 1** | Interview | 3 min | General conversation, self-introduction, opinions on general topics |
| **Part 2** | Collaborative Task | 4 min | Photos as basis for collaborative discussion task |
| **Part 3** | Long Turn + Discussion | 8 min | 2-min individual speech from prompt card, then discussion on themes |

**Total Duration:** 16 minutes (pair)
**Note:** CPE has 3 parts, not 4 like B2/C1

### 2.4 Assessment Criteria (All Levels)

Cambridge uses **5 assessment criteria**, each scored **0-5** in **0.5 increments**:

| Criterion | What It Measures |
|-----------|------------------|
| **Grammar & Vocabulary** | Range and accuracy of grammatical structures; appropriacy of vocabulary |
| **Discourse Management** | Coherence, cohesion, relevance, extent of contributions, organization of ideas |
| **Pronunciation** | Intelligibility, intonation, word/sentence stress, articulation of sounds |
| **Interactive Communication** | Initiating/responding, turn-taking, development of interaction, sensitivity to partner |
| **Global Achievement** | Overall effectiveness of communication (assessed by interlocutor) |

**Scoring Structure:**
- Assessor marks: Grammar, Vocabulary, Discourse, Pronunciation, Interactive Communication
- Interlocutor marks: Global Achievement only
- Each criterion doubled for total score calculation
- Maximum raw score: 75 marks → converted to Cambridge Scale (142-210 for C1)

**Band Descriptors (Band 5 = Highest):**

| Band | Description |
|------|-------------|
| **5** | Full operational command, native-like proficiency, very minor errors only |
| **4** | Good control, occasional errors, effective communication |
| **3** | Satisfactory control, some errors but generally successful communication |
| **2** | Limited control, frequent errors affecting communication |
| **1** | Very limited, basic phrases only |
| **0** | No assessable language |

### 2.5 Key Differences Between Levels

| Aspect | B2 First | C1 Advanced | C2 Proficiency |
|--------|----------|-------------|----------------|
| Parts | 4 | 4 | 3 |
| Duration | 14 min | 15 min | 16 min |
| Part 2 Photos | 2 photos | 3 photos (pick 2) | Photos for collaboration |
| Complexity | Familiar topics | Abstract topics | Sophisticated discourse |
| Vocabulary | Common collocations | Less common vocabulary | Near-native range |
| Grammar | Complex structures | Wide range | Full flexibility |

---

## 3. User Acquisition & Onboarding

### 3.1 Flow A: Self-Download Users (TikTok/Instagram Ads)

```
App Store Download
    ↓
Welcome Screen (no login required)
    ↓
Onboarding:
    1. Select target exam (B2/C1/C2)
    2. Set exam date
    3. Quick tutorial (30 sec)
    ↓
FREE TRIAL EXAM
    - One complete exam simulation
    - Receive GRADE ONLY (no detailed feedback)
    - Show locked/blurred premium feedback as preview
    ↓
Prompt: Create Account + Subscribe
    - "Save your progress"
    - "Get detailed feedback & personalized plan"
    ↓
Convert → Full Access
    OR
Leave → Data saved locally for return
```

### 3.2 Flow B: Academy-Invited Users (B2B)

```
Academy Admin creates student account
    - Email, name, target exam, class assignment
    ↓
Student receives email/SMS with magic link
    ↓
Opens link → App auto-downloads or opens
    - Auto-authenticated via token
    ↓
Set Password screen
    ↓
Brief tutorial
    ↓
Full access (academy subscription)
    - Practice plan pre-configured
    - Progress visible to academy admin
```

### 3.3 User Data Model

```typescript
interface User {
  id: string;
  email?: string;
  displayName?: string;
  avatarUrl?: string;

  // Auth
  authType: 'anonymous' | 'email' | 'oauth' | 'academy_invite';

  // Academy (B2B)
  academyId?: string;
  academyGroupId?: string;
  invitedBy?: string;

  // Onboarding
  onboardingComplete: boolean;
  hasUsedFreeTrial: boolean;

  // Exam planning
  targetExamLevel: 'B2' | 'C1' | 'C2';
  targetExamDate: Date;
  dailyPracticeGoal: number; // max 45 min

  createdAt: Date;
  updatedAt: Date;
}
```

---

## 4. Technical Architecture

### 4.1 Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Framework** | React Native + Expo (managed) | Cross-platform, fast development |
| **Navigation** | Expo Router | File-based routing, deep linking |
| **State** | Zustand + React Query | Lightweight, server state caching |
| **Styling** | NativeWind (Tailwind) | Consistent, rapid UI development |
| **Backend** | Supabase | PostgreSQL, auth, storage, real-time |
| **Auth** | Supabase Auth | Email, OAuth, magic links |
| **Conversational AI** | ElevenLabs Conversational AI | Real-time voice conversation |
| **Speech-to-Text** | ElevenLabs STT | Transcription for grading |
| **Grading LLM** | GPT-4o-mini / Claude Haiku | Cost-effective analysis |
| **Payments** | RevenueCat | Cross-platform subscriptions |
| **Notifications** | Expo Notifications | Push + local notifications |

### 4.2 Speech Architecture (Hybrid Approach)

⚠️ **Cost Optimization Strategy:** We use a **hybrid architecture** to minimize API costs while maintaining quality.

| Exam Part | Type | Implementation | Why |
|-----------|------|----------------|-----|
| **Part 1** (Interview) | Scripted Q&A | **TTS + VAD + STT** | Predetermined questions, no real dialogue needed |
| **Part 2** (Long Turn) | Monologue | **TTS + Recording + STT** | User speaks uninterrupted, no conversation |
| **Part 3** (Collaborative) | Real Dialogue | **ElevenLabs Conversational AI** | Requires natural back-and-forth, turn-taking |
| **Part 4** (Discussion) | Semi-scripted | **TTS + VAD + STT** | Follow-up questions can be branched/scripted |

**Cost Comparison:**

| Approach | Cost per 10 min | Best For |
|----------|-----------------|----------|
| **Conversational AI Agent** | ~$0.88-1.20 | Part 3 (real dialogue) |
| **TTS + STT + VAD** | ~$0.15 | Parts 1, 2, 4 (scripted) |

**Concurrency Analysis (Agents):**

Per [ElevenLabs pricing](https://elevenlabs.io/pricing) and [community discussion](https://www.reddit.com/r/ElevenLabs/comments/1m29tfh/understanding_concurrency_limits/):

| Tier | Price | Concurrent Agents | Supports Users* |
|------|-------|-------------------|-----------------|
| Free | $0 | 4 | ~1,300 |
| Starter | $5/mo | 6 | ~2,000 |
| Creator | $11/mo | 10 | ~3,300 |
| Pro | $99/mo | 20 | ~6,600 |
| Scale | $330/mo | 30 | ~10,000 |

*Estimated active users before hitting peak-hour concurrency limits (assumes Part 3 only, ~3 min/session, 10% peak hour traffic)

**Why concurrency is manageable:**
1. **Only Part 3 uses agents** - other parts use cheap TTS+STT
2. **Part 3 is short** (~3 minutes per user)
3. **Users are globally distributed** - peak hours spread across timezones
4. **Not everyone practices daily** - sessions spread throughout week

**Example:** 1,000 active users → ~3 concurrent Part 3 sessions at peak → **Creator tier ($11/mo) is sufficient**

#### Architecture A: TTS + VAD + STT (Parts 1, 2, 4)

Uses [LiveKit VAD](https://docs.livekit.io/agents/start/voice-ai-quickstart/) for voice activity detection + [ElevenLabs TTS API](https://elevenlabs.io/docs/api-reference/text-to-speech/convert) + ElevenLabs STT.

```
┌─────────────────────────────────────────────────────────────────┐
│                    SCRIPTED EXAM FLOW                           │
│                  (Part 1, Part 2, Part 4)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐    │
│  │  Question    │     │  ElevenLabs  │     │   Audio      │    │
│  │  Bank        │────▶│  TTS API     │────▶│   Playback   │    │
│  │  (scripted)  │     │              │     │              │    │
│  └──────────────┘     └──────────────┘     └──────────────┘    │
│                                                   │              │
│                                                   ▼              │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐    │
│  │  Transcript  │     │  ElevenLabs  │     │  LiveKit     │    │
│  │  + Grading   │◀────│  STT API     │◀────│  VAD         │    │
│  │              │     │              │     │  (silence    │    │
│  └──────────────┘     └──────────────┘     │   detection) │    │
│         │                                   └──────────────┘    │
│         ▼                                                       │
│  ┌──────────────┐                                               │
│  │  Next Q or   │                                               │
│  │  Branch Logic│ (optional: LLM picks next question)          │
│  └──────────────┘                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Part 1 (Interview) - Scripted Q&A Flow:**
```
Load question bank for level (B2/C1/C2)
    ↓
TTS: "Hello! Let's begin. Where are you from?"
    ↓
LiveKit VAD: Detect user speaking → silence (answer complete)
    ↓
STT: Transcribe user response
    ↓
(Optional) LLM selects contextual follow-up OR next scripted question
    ↓
TTS: Play next question
    ↓
Repeat for 2-3 minutes
    ↓
TTS: "Thank you. Let's move on to the next part."
    ↓
Transcript → Grading
```

**Part 2 (Long Turn) - Monologue Flow:**
```
Display photos to user
    ↓
TTS: "Compare these photos and say which person..."
    ↓
Start 60-second timer
    ↓
Record user audio (local recording)
    ↓
Timer ends OR VAD detects extended silence
    ↓
STT: Transcribe full response
    ↓
TTS: Brief follow-up question (30 sec)
    ↓
Record + STT follow-up response
    ↓
Transcript → Grading
```

**Part 4 (Discussion) - Semi-Scripted Flow:**
```
Load discussion questions based on Part 3 topic
    ↓
TTS: "Do you think [topic] is important in modern society?"
    ↓
VAD: Detect user response complete
    ↓
STT: Transcribe
    ↓
(Optional) LLM picks contextual follow-up from question bank
    ↓
Repeat for 4-5 minutes
    ↓
Transcript → Grading
```

#### Architecture B: Conversational AI Agent (Part 3 Only)

Uses [ElevenLabs Conversational AI](https://elevenlabs.io/docs/agents-platform/guides/integrations/expo-react-native) for natural back-and-forth dialogue.

```
┌─────────────────────────────────────────────────────────────────┐
│                 CONVERSATIONAL EXAM FLOW                        │
│                      (Part 3 Only)                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              ElevenLabs Conversational AI                 │  │
│  │                                                           │  │
│  │   ┌─────────┐    ┌─────────┐    ┌─────────┐             │  │
│  │   │  Agent  │◀──▶│ WebRTC  │◀──▶│  User   │             │  │
│  │   │ (LLM +  │    │ Stream  │    │  Voice  │             │  │
│  │   │  TTS +  │    │         │    │         │             │  │
│  │   │  STT)   │    │         │    │         │             │  │
│  │   └─────────┘    └─────────┘    └─────────┘             │  │
│  │                                                           │  │
│  │   • Natural turn-taking                                   │  │
│  │   • Dynamic responses based on user input                 │  │
│  │   • Interruption handling                                 │  │
│  │   • Real collaborative discussion                         │  │
│  │                                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│                    Full Transcript                              │
│                         │                                       │
│                         ▼                                       │
│                    LLM Grading                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Part 3 (Collaborative Task) Flow:**
```
Initialize ElevenLabs Conversation Agent
    - System prompt: Cambridge examiner + collaborative partner persona
    - Visual prompts loaded (if applicable)
    ↓
Real-time voice conversation via WebRTC
    - Natural turn-taking
    - Agent responds dynamically to user ideas
    - Guides discussion toward decision-making
    ↓
Agent manages timing (~3 min)
    ↓
Agent: "So, what have we decided?"
    ↓
Session ends
    ↓
Full transcript → LLM Grading
```

**Why Part 3 Needs Conversational AI:**
- Requires **natural interruptions** ("Oh, I see what you mean, but...")
- User and examiner must **build on each other's ideas**
- Needs **dynamic responses** based on user's actual suggestions
- Must reach a **collaborative decision** together
- Scripted approach would feel robotic and unrealistic

### 4.3 Folder Structure

```
mintzo/
├── app/                              # Expo Router
│   ├── (auth)/
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── set-password.tsx          # Academy invites
│   │   └── forgot-password.tsx
│   ├── (onboarding)/
│   │   ├── welcome.tsx
│   │   ├── select-level.tsx
│   │   ├── set-exam-date.tsx
│   │   └── tutorial.tsx
│   ├── (tabs)/
│   │   ├── index.tsx                 # Home + Practice Plan
│   │   ├── practice.tsx              # Start practice
│   │   ├── progress.tsx              # Stats + Contributions graph
│   │   └── profile.tsx               # Settings
│   ├── exam/
│   │   ├── free-trial.tsx
│   │   ├── [level]/
│   │   │   └── [part].tsx
│   │   └── session/
│   │       ├── [id].tsx              # Active exam
│   │       └── results/[id].tsx
│   ├── subscription.tsx              # Paywall
│   └── _layout.tsx
│
├── src/
│   ├── components/
│   │   ├── ui/                       # Button, Card, Input, etc.
│   │   ├── exam/
│   │   │   ├── PhotoDisplay.tsx
│   │   │   ├── PromptCard.tsx
│   │   │   ├── ConversationScreen.tsx   # ElevenLabs conversation UI
│   │   │   ├── BreathingOrb.tsx         # Animated orb for conv. parts
│   │   │   ├── Timer.tsx
│   │   │   ├── Waveform.tsx
│   │   │   └── TranscriptView.tsx
│   │   ├── gamification/
│   │   │   ├── ContributionsGraph.tsx
│   │   │   ├── StreakDisplay.tsx
│   │   │   ├── XPProgress.tsx
│   │   │   ├── LevelBadge.tsx
│   │   │   └── AchievementCard.tsx
│   │   ├── plan/
│   │   │   ├── ExamCountdown.tsx
│   │   │   ├── DailyPlan.tsx
│   │   │   └── ProgressRing.tsx
│   │   └── feedback/
│   │       ├── ScoreCard.tsx
│   │       ├── GrammarHighlight.tsx
│   │       └── FeedbackSection.tsx
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── hooks/useAuth.ts
│   │   │   └── services/authService.ts
│   │   ├── exam/
│   │   │   ├── hooks/
│   │   │   │   ├── useExamSession.ts
│   │   │   │   └── useExamTimer.ts
│   │   │   └── services/examService.ts
│   │   ├── voice/
│   │   │   ├── hooks/
│   │   │   │   ├── useConversationalAI.ts    # Part 3 only - ElevenLabs Agent
│   │   │   │   ├── useScriptedExam.ts        # Parts 1, 2, 4 - TTS+VAD+STT
│   │   │   │   ├── useVoiceActivityDetection.ts  # LiveKit VAD wrapper
│   │   │   │   ├── useAudioPlayback.ts       # TTS audio playback
│   │   │   │   └── useAudioRecording.ts      # Recording + STT
│   │   │   └── services/
│   │   │       ├── elevenlabsAgent.ts        # Conversational AI client
│   │   │       ├── elevenlabsTTS.ts          # TTS API client
│   │   │       ├── elevenlabsSTT.ts          # STT API client
│   │   │       ├── livekitVAD.ts             # Voice Activity Detection
│   │   │       └── questionBank.ts           # Scripted questions per level/part
│   │   ├── scoring/
│   │   │   ├── hooks/useScoring.ts
│   │   │   └── services/
│   │   │       ├── gradingEngine.ts
│   │   │       └── feedbackGenerator.ts
│   │   ├── gamification/
│   │   │   ├── hooks/
│   │   │   │   ├── useContributions.ts
│   │   │   │   ├── useStreak.ts
│   │   │   │   ├── useXP.ts
│   │   │   │   └── useAchievements.ts
│   │   │   └── services/gamificationService.ts
│   │   ├── plan/
│   │   │   ├── hooks/usePracticePlan.ts
│   │   │   └── services/planGenerator.ts
│   │   └── subscription/
│   │       ├── hooks/
│   │       │   ├── useSubscription.ts
│   │       │   └── useEntitlements.ts
│   │       └── components/Paywall.tsx
│   │
│   ├── services/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── auth.ts
│   │   │   ├── database.ts
│   │   │   └── storage.ts
│   │   ├── elevenlabs/
│   │   │   ├── conversationalAgent.ts
│   │   │   ├── speechToText.ts
│   │   │   └── textToSpeech.ts
│   │   ├── openai/
│   │   │   └── gradingEngine.ts
│   │   └── revenuecat/
│   │       └── client.ts
│   │
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── examStore.ts
│   │   ├── gamificationStore.ts
│   │   ├── planStore.ts
│   │   └── settingsStore.ts
│   │
│   ├── types/
│   │   ├── exam.ts
│   │   ├── user.ts
│   │   ├── gamification.ts
│   │   └── subscription.ts
│   │
│   ├── constants/
│   │   ├── examConfig.ts
│   │   ├── gamificationConfig.ts
│   │   └── theme.ts
│   │
│   └── utils/
│       ├── formatters.ts
│       ├── validators.ts
│       └── audioHelpers.ts
│
├── assets/
│   ├── images/
│   │   ├── exam-photos/              # Part 2 photos
│   │   ├── badges/
│   │   └── icons/
│   ├── fonts/
│   └── sounds/
│
├── supabase/
│   ├── migrations/
│   └── functions/
│       └── process-score/
│
├── app.json
├── eas.json
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── .npmrc                            # legacy-peer-deps=true
```

### 4.4 Voice Integration (Hybrid Architecture)

This section provides the complete implementation guide for the **hybrid voice architecture**:
- **Part 3 (Collaborative)**: ElevenLabs Conversational AI Agent via WebRTC
- **Parts 1, 2, 4**: ElevenLabs TTS API + STT API + LiveKit VAD

**References:**
- [ElevenLabs Expo React Native Integration](https://elevenlabs.io/docs/agents-platform/guides/integrations/expo-react-native)
- [ElevenLabs TTS API](https://elevenlabs.io/docs/api-reference/text-to-speech/convert)
- [ElevenLabs Agents SDK React Native Expo](https://elevenlabs.io/docs/agents-platform/libraries/react-native) -> VERY IMPORTANT TO USE AND CONSULT

#### 4.4.1 Dependencies Installation

```bash
# ElevenLabs Conversational AI SDK (for Part 3)
npx expo install @elevenlabs/react-native @livekit/react-native @livekit/react-native-webrtc @config-plugins/react-native-webrtc @livekit/react-native-expo-plugin livekit-client

# Audio recording and playback
npx expo install expo-av expo-file-system

# Additional utilities
npx expo install axios
```

**Note:** If you encounter peer dependency issues, create a `.npmrc` file in the project root:

```
legacy-peer-deps=true
```

#### 4.4.2 App Configuration (app.json)

```json
{
  "expo": {
    "scheme": "mintzo",
    "ios": {
      "infoPlist": {
        "NSMicrophoneUsageDescription": "Mintzo needs microphone access to conduct speaking exam practice sessions with your AI examiner."
      },
      "supportsTablet": true,
      "bundleIdentifier": "com.mintzo.app"
    },
    "android": {
      "permissions": [
        "android.permission.RECORD_AUDIO",
        "android.permission.ACCESS_NETWORK_STATE",
        "android.permission.INTERNET",
        "android.permission.MODIFY_AUDIO_SETTINGS",
        "android.permission.WAKE_LOCK",
        "android.permission.BLUETOOTH"
      ],
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.mintzo.app"
    },
    "plugins": [
      "@livekit/react-native-expo-plugin",
      "@config-plugins/react-native-webrtc"
    ]
  }
}
```

#### 4.4.3 Environment Variables

```bash
# ElevenLabs API Key (for TTS/STT - Parts 1, 2, 4)
EXPO_PUBLIC_ELEVENLABS_API_KEY=<your_api_key>
EXPO_PUBLIC_ELEVENLABS_VOICE_ID=<british_examiner_voice_id>

# ElevenLabs Conversational AI Agents (Part 3 ONLY - saves costs!)
EXPO_PUBLIC_ELEVENLABS_AGENT_ID_B2_PART3=<agent_id>
EXPO_PUBLIC_ELEVENLABS_AGENT_ID_C1_PART3=<agent_id>
EXPO_PUBLIC_ELEVENLABS_AGENT_ID_C2_PART3=<agent_id>

# Supabase
EXPO_PUBLIC_SUPABASE_URL=<your_supabase_url>
EXPO_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>

# RevenueCat
EXPO_PUBLIC_REVENUECAT_IOS_KEY=<ios_key>
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=<android_key>
```

---

## 4.5 TTS + VAD + STT Implementation (Parts 1, 2, 4)

This approach is **~85% cheaper** than Conversational AI and has **no concurrency limits**.

**Lazy Audio Caching Strategy (for recycled questions):**
Questions are drawn from a finite, recycled pool in Supabase (randomized per session). The same question text will appear repeatedly across users/sessions. To eliminate repeat TTS API calls:
- Check if `audio_url` exists in the question record.
- If yes: Play from Supabase Storage URL (direct or downloaded to cache).
- If no: Generate TTS on-demand, play, then upload to Supabase via secure Edge Function for future reuse.
- Result: First-use pays tiny TTS cost; all subsequent plays are free (just negligible storage/egress).

This builds the cache organically—no upfront batch generation needed. Popular/frequent questions cache first.

**ElevenLabs TTS Service** (updated with caching awareness):

```typescript
// src/features/voice/services/elevenlabsTTS.ts
// ... (keep existing textToSpeech and playAudio functions unchanged)

// New helper: Upload generated audio to Supabase (called after playback)
export async function uploadToCache(questionId: string, level: ExamLevel, part: ExamPart, localAudioPath: string): Promise<string | null> {
  try {
    const base64Audio = await FileSystem.readAsStringAsync(localAudioPath, { encoding: FileSystem.EncodingType.Base64 });

    const { data, error } = await supabase.functions.invoke('generate-and-cache-audio', {
      body: {
        questionId,
        level,
        part,
        audioBase64: base64Audio,
      },
    });

    if (error) {
      console.warn('Audio cache upload failed:', error);
      return null;
    }

    return data.url;  // Returns the new public/signed URL
  } catch (e) {
    console.warn('Cache upload error:', e);
    return null;
  }
}
```

**Pre-generate common phrases for faster playback** (unchanged, but note: these can also be cached in Supabase if desired for global reuse):

```typescript
// ... (keep preloadCommonPhrases as-is; it's local cache only)
```

#### 4.5.2 ElevenLabs STT Service

```typescript
// src/features/voice/services/elevenlabsSTT.ts
import axios from 'axios';
import * as FileSystem from 'expo-file-system';

const ELEVENLABS_API_KEY = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY;
const API_BASE = 'https://api.elevenlabs.io/v1';

interface STTResult {
  text: string;
  words?: Array<{
    word: string;
    start: number;
    end: number;
    confidence: number;
  }>;
}

export async function speechToText(audioPath: string): Promise<STTResult> {
  const audioBase64 = await FileSystem.readAsStringAsync(audioPath, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const formData = new FormData();
  formData.append('audio', {
    uri: audioPath,
    type: 'audio/m4a',
    name: 'recording.m4a',
  } as any);

  const response = await axios.post(
    `${API_BASE}/speech-to-text`,
    formData,
    {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return {
    text: response.data.text,
    words: response.data.words,
  };
}
```

#### 4.5.3 Voice Activity Detection (VAD)

Simple VAD implementation using audio metering from expo-av:

```typescript
// src/features/voice/services/voiceActivityDetection.ts
import { Audio } from 'expo-av';

interface VADConfig {
  silenceThreshold: number;      // dB level below which is silence
  silenceDuration: number;       // ms of silence to consider "done speaking"
  maxRecordingDuration: number;  // max recording time in ms
}

const DEFAULT_CONFIG: VADConfig = {
  silenceThreshold: -40,         // dB
  silenceDuration: 1500,         // 1.5 seconds of silence
  maxRecordingDuration: 120000,  // 2 minutes max
};

interface VADCallbacks {
  onSpeechStart?: () => void;
  onSpeechEnd?: (audioUri: string) => void;
  onSilenceDetected?: () => void;
  onMeteringUpdate?: (db: number) => void;
}

export class VoiceActivityDetector {
  private recording: Audio.Recording | null = null;
  private config: VADConfig;
  private callbacks: VADCallbacks;
  private silenceStartTime: number | null = null;
  private isSpeaking = false;
  private meteringInterval: NodeJS.Timeout | null = null;

  constructor(callbacks: VADCallbacks, config: Partial<VADConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.callbacks = callbacks;
  }

  async start(): Promise<void> {
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    this.recording = new Audio.Recording();
    await this.recording.prepareToRecordAsync({
      ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
      isMeteringEnabled: true,
    });

    await this.recording.startAsync();
    this.startMetering();
  }

  private startMetering(): void {
    this.meteringInterval = setInterval(async () => {
      if (!this.recording) return;

      const status = await this.recording.getStatusAsync();
      if (!status.isRecording) return;

      const db = status.metering ?? -160;
      this.callbacks.onMeteringUpdate?.(db);

      if (db > this.config.silenceThreshold) {
        // User is speaking
        if (!this.isSpeaking) {
          this.isSpeaking = true;
          this.callbacks.onSpeechStart?.();
        }
        this.silenceStartTime = null;
      } else {
        // Silence detected
        if (this.isSpeaking) {
          if (!this.silenceStartTime) {
            this.silenceStartTime = Date.now();
            this.callbacks.onSilenceDetected?.();
          } else if (Date.now() - this.silenceStartTime > this.config.silenceDuration) {
            // Silence long enough - user is done speaking
            await this.stop();
          }
        }
      }

      // Check max duration
      if (status.durationMillis > this.config.maxRecordingDuration) {
        await this.stop();
      }
    }, 100); // Check every 100ms
  }

  async stop(): Promise<string | null> {
    if (this.meteringInterval) {
      clearInterval(this.meteringInterval);
      this.meteringInterval = null;
    }

    if (!this.recording) return null;

    try {
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      this.recording = null;
      this.isSpeaking = false;
      this.silenceStartTime = null;

      if (uri) {
        this.callbacks.onSpeechEnd?.(uri);
      }

      return uri;
    } catch (error) {
      console.error('Error stopping recording:', error);
      return null;
    }
  }

  async cancel(): Promise<void> {
    if (this.meteringInterval) {
      clearInterval(this.meteringInterval);
    }
    if (this.recording) {
      try {
        await this.recording.stopAndUnloadAsync();
      } catch (e) {}
      this.recording = null;
    }
  }
}
```

#### 4.5.4 Scripted Exam Hook (Parts 1, 4) – Updated with Lazy Caching

```typescript
// src/features/voice/hooks/useScriptedExam.ts
// ... (keep existing imports and types)

export function useScriptedExam({ level, part, onComplete }: UseScriptedExamProps) {
  // ... (keep existing state, refs, addToTranscript, etc.)

  const askNextQuestion = useCallback(async () => {
    const questions = questionsRef.current;
    
    if (currentQuestionIndex >= questions.length) {
      setState('complete');
      onComplete(transcript);
      return;
    }

    setState('examiner_speaking');
    const question = questions[currentQuestionIndex];
    
    let audioPath: string;
    let generatedUrl: string | null = null;

    if (question.audio_url) {
      // Reuse cached audio from Supabase
      // Option: Direct play from URL (simplest, works offline if cached previously)
      const { sound } = await Audio.Sound.createAsync({ uri: question.audio_url });
      await sound.playAsync();
      // Wait for finish (keep your existing playback promise logic)
      await new Promise((resolve) => {
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            sound.unloadAsync();
            resolve();
          }
        });
      });
    } else {
      // On-demand TTS
      const generatedPath = await textToSpeech({ text: question.question_text });
      audioPath = generatedPath;

      // Play
      await playAudio(audioPath);

      // Upload to cache for future (async, fire-and-forget)
      uploadToCache(question.id, level, part, audioPath).then(url => {
        if (url) {
          // Optional: Update local question object or refetch if needed
          console.log('Cached audio URL:', url);
        }
      });
    }

    addToTranscript('examiner', question.question_text);

    // Start listening...
    setState('candidate_speaking');
    vadRef.current = new VoiceActivityDetector({
      // ... (unchanged VAD callbacks)
    });

    await vadRef.current.start();
  }, [currentQuestionIndex, transcript, addToTranscript, onComplete, level, part]);

  // ... (keep startExam, stopExam, etc. unchanged)
}
```

**Notes:**
- For Part 2 (prompts + follow-ups), apply the same check/upload logic to `prompt_text` and `follow_up_question`.
- Edge function handles secure upload (no client-side keys exposed).
- If upload fails (e.g., network), retry next time—question stays uncached until success.

#### 4.5.5 Exam Content Service (Database-Driven)

All exam content (questions, images, prompts) is stored in Supabase and fetched dynamically. Exams are constructed randomly from the content pool for each level/part.

```typescript
// src/features/voice/services/examContentService.ts
import { supabase } from '@/services/supabase/client';
import type { ExamLevel, ExamPart } from '@/types/exam';

interface ExamQuestion {
  id: string;
  level: ExamLevel;
  part: ExamPart;
  question_text: string;
  follow_up_questions?: string[];
  topic: string;
  difficulty: number;
}

interface Part2Content {
  id: string;
  level: ExamLevel;
  image_urls: string[];
  prompt_text: string;
  follow_up_question: string;
  topic: string;
}

interface Part3Content {
  id: string;
  level: ExamLevel;
  visual_prompt_url?: string;
  discussion_prompt: string;
  options: string[];  // The options to discuss/choose from
  topic: string;
}

// Fetch random questions for Parts 1 & 4
export async function getRandomQuestions(
  level: ExamLevel,
  part: 'part1' | 'part4',
  count: number = 6
): Promise<ExamQuestion[]> {
  const { data, error } = await supabase
    .from('exam_questions')
    .select('*')
    .eq('level', level)
    .eq('part', part)
    .eq('is_active', true)
    .limit(count * 2)  // Fetch more than needed for randomization
    .order('usage_count', { ascending: true });  // Prefer less-used questions

  if (error) throw error;

  // Shuffle and take required count
  const shuffled = data.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Fetch random Part 2 content (photos + prompt)
export async function getRandomPart2Content(
  level: ExamLevel
): Promise<Part2Content> {
  const { data, error } = await supabase
    .from('exam_part2_content')
    .select('*')
    .eq('level', level)
    .eq('is_active', true)
    .order('usage_count', { ascending: true })
    .limit(10);

  if (error) throw error;

  // Random selection
  const index = Math.floor(Math.random() * data.length);
  return data[index];
}

// Fetch random Part 3 content (collaborative task)
export async function getRandomPart3Content(
  level: ExamLevel
): Promise<Part3Content> {
  const { data, error } = await supabase
    .from('exam_part3_content')
    .select('*')
    .eq('level', level)
    .eq('is_active', true)
    .order('usage_count', { ascending: true })
    .limit(10);

  if (error) throw error;

  const index = Math.floor(Math.random() * data.length);
  return data[index];
}

// Construct a full exam session
export async function constructExamSession(level: ExamLevel): Promise<{
  part1Questions: ExamQuestion[];
  part2Content: Part2Content;
  part3Content: Part3Content;
  part4Questions: ExamQuestion[];
}> {
  const [part1Questions, part2Content, part3Content, part4Questions] = await Promise.all([
    getRandomQuestions(level, 'part1', 6),
    getRandomPart2Content(level),
    getRandomPart3Content(level),
    getRandomQuestions(level, 'part4', 5),
  ]);

  return { part1Questions, part2Content, part3Content, part4Questions };
}

// Increment usage count after exam
export async function markContentUsed(contentIds: string[], table: string): Promise<void> {
  await supabase.rpc('increment_usage_count', {
    p_table: table,
    p_ids: contentIds,
  });
}
```

---

## 4.6 Conversational AI Implementation (Part 3 Only)

Part 3 (Collaborative Task) **requires** real conversational AI because:
- Natural back-and-forth dialogue
- Dynamic responses to user ideas
- Must reach collaborative decision together

#### 4.6.1 Provider Setup (Root Layout)

Wrap the app with `ElevenLabsProvider` in `app/_layout.tsx`:

```tsx
// app/_layout.tsx
import { ElevenLabsProvider } from '@elevenlabs/react-native';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <ElevenLabsProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="exam" />
        <Stack.Screen name="subscription" options={{ presentation: 'modal' }} />
      </Stack>
    </ElevenLabsProvider>
  );
}
```

#### 4.6.2 Conversation Hook Implementation (Part 3 Only)

This hook is ONLY used for Part 3 (Collaborative Task). Parts 1, 2, and 4 use the scripted approach in Section 4.5.

```typescript
// src/features/voice/hooks/useConversationalAI.ts
import { useConversation } from '@elevenlabs/react-native';
import type { 
  ConversationStatus, 
  ConversationEvent, 
  Role 
} from '@elevenlabs/react-native';
import { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import type { ExamLevel } from '@/types/exam';

interface UseConversationalAIProps {
  level: ExamLevel;
  collaborativeTaskContent?: string;  // The task prompt/images description
  onTranscriptUpdate?: (transcript: string, role: Role) => void;
  onSessionEnd?: (fullTranscript: string) => void;
}

interface ConversationMessage {
  role: Role;
  content: string;
  timestamp: Date;
}

// Part 3 agents ONLY - saves significant costs!
const PART3_AGENT_IDS: Record<ExamLevel, string> = {
  B2: process.env.EXPO_PUBLIC_ELEVENLABS_AGENT_ID_B2_PART3!,
  C1: process.env.EXPO_PUBLIC_ELEVENLABS_AGENT_ID_C1_PART3!,
  C2: process.env.EXPO_PUBLIC_ELEVENLABS_AGENT_ID_C2_PART3!,
};

export function useConversationalAI({
  level,
  part,
  onTranscriptUpdate,
  onSessionEnd,
}: UseConversationalAIProps) {
  const [isStarting, setIsStarting] = useState(false);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const conversation = useConversation({
    onConnect: ({ conversationId }) => {
      console.log('✅ Connected to conversation', conversationId);
      setSessionId(conversationId);
    },
    onDisconnect: (details) => {
      console.log('❌ Disconnected from conversation', details);
      // Compile full transcript and trigger callback
      const fullTranscript = messages
        .map((m) => `${m.role}: ${m.content}`)
        .join('\n');
      onSessionEnd?.(fullTranscript);
    },
    onError: (message, context) => {
      console.error('❌ Conversation error:', message, context);
    },
    onMessage: ({ message, source }) => {
      console.log(`💬 Message from ${source}:`, message);
      const newMessage: ConversationMessage = {
        role: source,
        content: typeof message === 'string' ? message : JSON.stringify(message),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
      onTranscriptUpdate?.(newMessage.content, source);
    },
    onModeChange: ({ mode }) => {
      console.log(`🔊 Mode: ${mode}`);
    },
    onStatusChange: ({ status }) => {
      console.log(`📡 Status: ${status}`);
    },
  });

  const startSession = useCallback(async (dynamicVariables?: Record<string, string>) => {
    if (isStarting) return;

    const agentId = AGENT_IDS[level]?.[part];
    if (!agentId) {
      throw new Error(`No agent configured for ${level} ${part}`);
    }

    setIsStarting(true);
    setMessages([]);

    try {
      await conversation.startSession({
        agentId,
        dynamicVariables: {
          platform: Platform.OS,
          examLevel: level,
          examPart: part,
          ...dynamicVariables,
        },
      });
    } catch (error) {
      console.error('Failed to start conversation:', error);
      throw error;
    } finally {
      setIsStarting(false);
    }
  }, [conversation, level, part, isStarting]);

  const endSession = useCallback(async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      console.error('Failed to end conversation:', error);
    }
  }, [conversation]);

  const sendTextMessage = useCallback((text: string) => {
    if (conversation.status === 'connected') {
      conversation.sendUserMessage(text);
    }
  }, [conversation]);

  const sendContextualUpdate = useCallback((context: string) => {
    if (conversation.status === 'connected') {
      conversation.sendContextualUpdate(context);
    }
  }, [conversation]);

  return {
    // State
    status: conversation.status,
    isSpeaking: conversation.isSpeaking,
    isStarting,
    sessionId,
    messages,

    // Actions
    startSession,
    endSession,
    sendTextMessage,
    sendContextualUpdate,

    // Computed
    canStart: conversation.status === 'disconnected' && !isStarting,
    canEnd: conversation.status === 'connected',
    isConnected: conversation.status === 'connected',
  };
}
```

#### 4.4.6 Exam Conversation Screen Component

```tsx
// src/components/exam/ConversationScreen.tsx
import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { useConversationalAI } from '@/features/voice/hooks/useConversationalAI';
import { BreathingOrb } from './BreathingOrb';
import type { ExamLevel, ExamPart } from '@/types/exam';

interface ConversationScreenProps {
  level: ExamLevel;
  part: ExamPart;
  onComplete: (transcript: string) => void;
}

export function ConversationScreen({ 
  level, 
  part, 
  onComplete 
}: ConversationScreenProps) {
  const {
    status,
    isSpeaking,
    startSession,
    endSession,
    canStart,
  } = useConversationalAI({
    level,
    part,
    onSessionEnd: onComplete,
  });

  // Auto-start session when component mounts
  useEffect(() => {
    if (canStart) {
      startSession();
    }
    
    return () => {
      endSession();
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Breathing orb - the only visual element during conversation */}
      <BreathingOrb 
        isActive={status === 'connected'} 
        isSpeaking={isSpeaking} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

#### 4.4.7 Breathing Orb Animation Component

```tsx
// src/components/exam/BreathingOrb.tsx
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';

interface BreathingOrbProps {
  isActive: boolean;
  isSpeaking: boolean;
}

const COLORS = {
  base: '#3B82F6',      // Blue 500
  light: '#60A5FA',     // Blue 400
  lighter: '#93C5FD',   // Blue 300
  speaking: '#8B5CF6',  // Violet 500
};

export function BreathingOrb({ isActive, isSpeaking }: BreathingOrbProps) {
  const scale = useSharedValue(1);
  const colorProgress = useSharedValue(0);
  const speakingScale = useSharedValue(1);

  useEffect(() => {
    if (isActive) {
      // Breathing animation - 4 second cycle
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );

      // Color cycling
      colorProgress.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 2000 }),
          withTiming(0, { duration: 2000 })
        ),
        -1,
        false
      );
    } else {
      scale.value = withTiming(0.8, { duration: 300 });
    }
  }, [isActive]);

  useEffect(() => {
    if (isSpeaking) {
      // Pulse faster when AI is speaking
      speakingScale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 150 }),
          withTiming(1.05, { duration: 150 })
        ),
        -1,
        true
      );
    } else {
      speakingScale.value = withTiming(1, { duration: 200 });
    }
  }, [isSpeaking]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      colorProgress.value,
      [0, 0.5, 1],
      [COLORS.base, COLORS.lighter, COLORS.light]
    );

    return {
      transform: [
        { scale: scale.value * speakingScale.value },
      ],
      backgroundColor: isSpeaking ? COLORS.speaking : backgroundColor,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.orb, animatedStyle]}>
        <View style={styles.innerGlow} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  orb: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 10,
  },
  innerGlow: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});
```

#### 4.4.8 ElevenLabs Agent Configuration

For each exam level and part combination, create a separate agent in the [ElevenLabs Agents Platform](https://elevenlabs.io/app/agents/agents):

**Agent Setup Checklist:**

1. **Create Agent** from blank template
2. **Set First Message** with dynamic variables:
   ```
   Hello! Welcome to your {{examLevel}} speaking exam practice. We're going to start with {{examPart}}. 
   Are you ready to begin?
   ```
3. **Set System Prompt** (example for B2 Part 1):
   ```
   You are a Cambridge B2 First speaking examiner conducting Part 1 (Interview).
   
   Your role:
   - Ask the candidate personal questions about their life, interests, studies, and future plans
   - Be professional, warm, and encouraging
   - Allow natural pauses for the candidate to think
   - Ask follow-up questions based on their answers
   - Manage the timing (approximately 2 minutes total)
   
   Question bank for Part 1:
   - Where are you from? / Tell me about your hometown.
   - What do you do? Are you a student or do you work?
   - What do you enjoy doing in your free time?
   - Do you have any plans for the future?
   - What kind of music/films/books do you like?
   
   After approximately 2 minutes, politely conclude: "Thank you. Now let's move on to the next part."
   
   The candidate is using platform: {{platform}}
   Exam level: {{examLevel}}
   Current part: {{examPart}}
   ```

4. **Voice Selection**: Choose a clear, professional British English voice
5. **Enable Transcription**: Ensure full conversation transcription is enabled

**Timing Client Tool (Optional):**

Configure a client tool to track timing:

| Setting | Value |
|---------|-------|
| Name | `getElapsedTime` |
| Description | Returns elapsed time in seconds since session started |
| Wait for response | `true` |
| Response timeout | 3 seconds |

#### 4.4.9 Build and Run Instructions

Since ElevenLabs SDK uses native WebRTC modules, Expo Go is **not supported**. You must use a development build:

```bash
# 1. Clean prebuild (generates native iOS/Android folders)
npx expo prebuild --clean

# 2. Start Metro bundler with tunnel (for device testing)
npx expo start --tunnel

# 3. In a separate terminal, build and run on device
# For iOS (requires Xcode + Apple Developer account)
npx expo run:ios --device

# For Android
npx expo run:android --device
```

**Development Tips:**
- Use physical devices for best audio quality
- Test on both iOS and Android early - WebRTC behavior differs
- Monitor console for connection status logs
- Network connectivity is critical - test on WiFi and cellular

#### 4.4.10 Error Handling and Recovery

```typescript
// src/features/voice/services/conversationErrorHandler.ts
import type { ConversationStatus } from '@elevenlabs/react-native';

interface ErrorRecoveryConfig {
  maxRetries: number;
  retryDelayMs: number;
}

const DEFAULT_CONFIG: ErrorRecoveryConfig = {
  maxRetries: 3,
  retryDelayMs: 2000,
};

export class ConversationErrorHandler {
  private retryCount = 0;
  private config: ErrorRecoveryConfig;

  constructor(config: Partial<ErrorRecoveryConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async handleError(
    error: Error,
    retryFn: () => Promise<void>
  ): Promise<boolean> {
    console.error('Conversation error:', error.message);

    // Check if retryable
    if (this.isRetryableError(error) && this.retryCount < this.config.maxRetries) {
      this.retryCount++;
      console.log(`Retrying... Attempt ${this.retryCount}/${this.config.maxRetries}`);
      
      await this.delay(this.config.retryDelayMs);
      
      try {
        await retryFn();
        this.retryCount = 0;
        return true;
      } catch (retryError) {
        return this.handleError(retryError as Error, retryFn);
      }
    }

    return false;
  }

  private isRetryableError(error: Error): boolean {
    const retryableMessages = [
      'network',
      'timeout',
      'connection',
      'WebRTC',
    ];
    
    return retryableMessages.some(msg => 
      error.message.toLowerCase().includes(msg.toLowerCase())
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  reset(): void {
    this.retryCount = 0;
  }
}
```

#### 4.4.11 Type Definitions

```typescript
// src/types/elevenlabs.ts
export type ConversationStatus = 'disconnected' | 'connecting' | 'connected';

export interface ConversationCallbacks {
  onConnect?: (data: { conversationId: string }) => void;
  onDisconnect?: (details: string) => void;
  onError?: (message: string, context?: Record<string, unknown>) => void;
  onMessage?: (data: { message: ConversationEvent; source: Role }) => void;
  onModeChange?: (data: { mode: 'speaking' | 'listening' }) => void;
  onStatusChange?: (data: { status: ConversationStatus }) => void;
  onCanSendFeedbackChange?: (data: { canSendFeedback: boolean }) => void;
}

export type Role = 'user' | 'assistant';

export type ConversationEvent = string | Record<string, unknown>;

export interface SessionConfig {
  agentId: string;
  dynamicVariables?: Record<string, string>;
}
```

---

## 4.7 Backend Architecture

⚠️ **Security Note:** API keys (ElevenLabs, OpenAI) must NEVER be exposed on the client. All API calls go through Supabase Edge Functions.

### 4.7.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT (React Native)                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────────┐  │
│  │ Parts 1,2,4  │  │   Part 3     │  │      Exam Management         │  │
│  │ (Scripted)   │  │ (Conv. AI)   │  │                              │  │
│  │              │  │              │  │  • Construct exam            │  │
│  │ TTS → Play   │  │ WebRTC      │  │  • Submit for grading        │  │
│  │ Record → STT │  │ Direct      │  │  • View results              │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┬───────────────┘  │
│         │                 │                         │                   │
└─────────┼─────────────────┼─────────────────────────┼───────────────────┘
          │                 │                         │
          ▼                 ▼                         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    SUPABASE EDGE FUNCTIONS                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │ /voice/tts       │  │ /voice/agent     │  │ /exam/grade          │  │
│  │                  │  │                  │  │                      │  │
│  │ • Generate TTS   │  │ • Get signed URL │  │ • GPT-4o grading     │  │
│  │ • Return audio   │  │ • Dynamic vars   │  │ • Store results      │  │
│  └────────┬─────────┘  └────────┬─────────┘  └──────────┬───────────┘  │
│           │                     │                       │               │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │ /voice/stt       │  │ /voice/webhook   │  │ /exam/content        │  │
│  │                  │  │                  │  │                      │  │
│  │ • Transcribe     │  │ • Conv. events   │  │ • Random questions   │  │
│  │ • Return text    │  │ • Save transcript│  │ • Part 2/3 content   │  │
│  └────────┬─────────┘  └────────┬─────────┘  └──────────┬───────────┘  │
│           │                     │                       │               │
└───────────┼─────────────────────┼───────────────────────┼───────────────┘
            │                     │                       │
            ▼                     ▼                       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL SERVICES                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │   ElevenLabs     │  │    OpenAI        │  │    Supabase DB       │  │
│  │                  │  │                  │  │                      │  │
│  │ • TTS API        │  │ • GPT-4o-mini    │  │ • exam_content       │  │
│  │ • STT API        │  │ • Grading        │  │ • exam_sessions      │  │
│  │ • Conv. Agents   │  │                  │  │ • user_progress      │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.7.2 Supabase Edge Functions

**Folder Structure:**
```
supabase/
├── functions/
│   ├── voice-tts/
│   │   └── index.ts          # Text-to-Speech
│   ├── voice-stt/
│   │   └── index.ts          # Speech-to-Text
│   ├── voice-agent-session/
│   │   └── index.ts          # Get Conv. AI signed URL
│   ├── voice-webhook/
│   │   └── index.ts          # Conv. AI event webhooks
│   ├── exam-content/
│   │   └── index.ts          # Fetch random exam content
│   ├── exam-grade/
│   │   └── index.ts          # Grade transcript with GPT
│   └── _shared/
│       ├── elevenlabs.ts     # ElevenLabs client
│       ├── openai.ts         # OpenAI client
│       └── cors.ts           # CORS headers
└── .env                       # Secret API keys (NOT in repo)
```

### 4.7.3 Text-to-Speech Edge Function

```typescript
// supabase/functions/voice-tts/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
const VOICE_ID = Deno.env.get('ELEVENLABS_VOICE_ID');

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { text, voiceId } = await req.json();

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId || VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs error: ${response.status}`);
    }

    // Return audio as base64
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(audioBuffer))
    );

    return new Response(
      JSON.stringify({ audio: base64Audio, format: 'mp3' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
```

### 4.7.4 Speech-to-Text Edge Function

```typescript
// supabase/functions/voice-stt/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      throw new Error('No audio file provided');
    }

    // Forward to ElevenLabs STT
    const elevenLabsFormData = new FormData();
    elevenLabsFormData.append('audio', audioFile);

    const response = await fetch(
      'https://api.elevenlabs.io/v1/speech-to-text',
      {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY!,
        },
        body: elevenLabsFormData,
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs STT error: ${response.status}`);
    }

    const result = await response.json();

    return new Response(
      JSON.stringify({
        text: result.text,
        words: result.words,  // Word-level timestamps for pronunciation analysis
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
```

### 4.7.5 Conversational AI Session Edge Function

For Part 3, clients need a signed URL to connect directly to ElevenLabs:

```typescript
// supabase/functions/voice-agent-session/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');

// Part 3 agents only
const AGENT_IDS = {
  B2: Deno.env.get('ELEVENLABS_AGENT_B2_PART3'),
  C1: Deno.env.get('ELEVENLABS_AGENT_C1_PART3'),
  C2: Deno.env.get('ELEVENLABS_AGENT_C2_PART3'),
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify user is authenticated
    const authHeader = req.headers.get('Authorization');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader! } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { level, part3ContentId, dynamicVariables } = await req.json();

    // Verify this is Part 3 (only part that uses Conv. AI)
    const agentId = AGENT_IDS[level as keyof typeof AGENT_IDS];
    if (!agentId) {
      throw new Error(`No agent configured for level: ${level}`);
    }

    // Fetch Part 3 content from DB to inject into agent
    const { data: content } = await supabase
      .from('exam_part3_content')
      .select('*')
      .eq('id', part3ContentId)
      .single();

    // Get signed URL from ElevenLabs
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY!,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get signed URL: ${response.status}`);
    }

    const { signed_url } = await response.json();

    // Log session start for analytics
    await supabase.from('conversation_sessions').insert({
      user_id: user.id,
      agent_id: agentId,
      level,
      content_id: part3ContentId,
      started_at: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({
        signedUrl: signed_url,
        agentId,
        // Pass content info for client to inject as dynamic variables
        contentPrompt: content?.discussion_prompt,
        contentOptions: content?.options,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: error.message === 'Unauthorized' ? 401 : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
```

### 4.7.6 Conversational AI Webhook Handler

ElevenLabs can send webhook events when conversations end, including full transcripts:

```typescript
// supabase/functions/voice-webhook/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const WEBHOOK_SECRET = Deno.env.get('ELEVENLABS_WEBHOOK_SECRET');

serve(async (req) => {
  try {
    // Verify webhook signature (if ElevenLabs provides one)
    const signature = req.headers.get('x-elevenlabs-signature');
    // TODO: Verify signature against WEBHOOK_SECRET

    const event = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!  // Service role for internal ops
    );

    switch (event.type) {
      case 'conversation.ended':
        // Save full transcript
        await supabase.from('conversation_sessions').update({
          ended_at: new Date().toISOString(),
          transcript: event.data.transcript,
          duration_seconds: event.data.duration,
          status: 'completed',
        }).eq('conversation_id', event.data.conversation_id);

        // Trigger grading (async)
        await supabase.functions.invoke('exam-grade', {
          body: {
            conversationId: event.data.conversation_id,
            transcript: event.data.transcript,
          },
        });
        break;

      case 'conversation.error':
        await supabase.from('conversation_sessions').update({
          status: 'error',
          error_message: event.data.error,
        }).eq('conversation_id', event.data.conversation_id);
        break;
    }

    return new Response('ok', { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('error', { status: 500 });
  }
});
```

### 4.7.7 Exam Content Fetch Function

```typescript
// supabase/functions/exam-content/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader! } } }
    );

    const { level } = await req.json();

    // Fetch random content for each part in parallel
    const [part1Questions, part2Content, part3Content, part4Questions] = await Promise.all([
      // Part 1: 6-8 random interview questions
      supabase
        .from('exam_questions')
        .select('id, question_text, follow_up_questions')
        .eq('level', level)
        .eq('part', 'part1')
        .eq('is_active', true)
        .order('usage_count', { ascending: true })
        .limit(15)
        .then(({ data }) => shuffleAndTake(data, 7)),

      // Part 2: Random photo set + prompt
      supabase
        .from('exam_part2_content')
        .select('id, image_urls, prompt_text, follow_up_question, topic')
        .eq('level', level)
        .eq('is_active', true)
        .order('usage_count', { ascending: true })
        .limit(10)
        .then(({ data }) => data?.[Math.floor(Math.random() * data.length)]),

      // Part 3: Random collaborative task
      supabase
        .from('exam_part3_content')
        .select('id, visual_prompt_url, discussion_prompt, options, topic')
        .eq('level', level)
        .eq('is_active', true)
        .order('usage_count', { ascending: true })
        .limit(10)
        .then(({ data }) => data?.[Math.floor(Math.random() * data.length)]),

      // Part 4: 5-6 discussion questions
      supabase
        .from('exam_questions')
        .select('id, question_text, follow_up_questions, topic')
        .eq('level', level)
        .eq('part', 'part4')
        .eq('is_active', true)
        .order('usage_count', { ascending: true })
        .limit(12)
        .then(({ data }) => shuffleAndTake(data, 6)),
    ]);

    return new Response(
      JSON.stringify({
        part1: part1Questions,
        part2: part2Content,
        part3: part3Content,
        part4: part4Questions,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function shuffleAndTake<T>(arr: T[] | null, count: number): T[] {
  if (!arr) return [];
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
```

### 4.7.8 Database Schema Updates (Exam Content)

Add these tables to the existing schema in Section 6:

```sql
-- ============================================
-- EXAM CONTENT (Questions, Images, Prompts)
-- ============================================

-- Part 1 & 4: Interview/Discussion questions
CREATE TABLE exam_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level TEXT NOT NULL CHECK (level IN ('B2', 'C1', 'C2')),
    part TEXT NOT NULL CHECK (part IN ('part1', 'part4')),
    topic TEXT NOT NULL,
    question_text TEXT NOT NULL,
    follow_up_questions TEXT[],  -- Optional follow-ups
    difficulty INTEGER DEFAULT 2 CHECK (difficulty BETWEEN 1 AND 3),
    usage_count INTEGER DEFAULT 0,
    average_response_score DECIMAL(2,1),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- Add for lazy audio caching
    audio_url TEXT,                          -- Public/signed URL to cached MP3 in Storage
    audio_generated_at TIMESTAMPTZ           -- Timestamp for potential invalidation/refresh
);

-- Part 2: Long Turn (photos + prompts)
CREATE TABLE exam_part2_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level TEXT NOT NULL CHECK (level IN ('B2', 'C1', 'C2')),
    topic TEXT NOT NULL,
    image_urls TEXT[] NOT NULL,  -- Array of 2-3 photo URLs
    prompt_text TEXT NOT NULL,   -- "Compare these photos and say..."
    follow_up_question TEXT NOT NULL,  -- Brief 30-sec question
    comparison_points TEXT[],    -- Hints for grading
    difficulty INTEGER DEFAULT 2,
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- Add for lazy audio caching
    audio_url TEXT,
    audio_generated_at TIMESTAMPTZ
);

-- Part 3: Collaborative Task
CREATE TABLE exam_part3_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level TEXT NOT NULL CHECK (level IN ('B2', 'C1', 'C2')),
    topic TEXT NOT NULL,
    visual_prompt_url TEXT,      -- Optional visual for task
    discussion_prompt TEXT NOT NULL,  -- Main question/scenario
    options TEXT[] NOT NULL,     -- The options to discuss (e.g., 5 things to prioritize)
    decision_prompt TEXT,        -- "Now decide which two..."
    difficulty INTEGER DEFAULT 2,
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- Add for lazy audio caching
    audio_url TEXT,
    audio_generated_at TIMESTAMPTZ
);

-- Conversation sessions (Part 3 tracking)
CREATE TABLE conversation_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    conversation_id TEXT UNIQUE,  -- ElevenLabs conversation ID
    agent_id TEXT NOT NULL,
    level TEXT NOT NULL,
    content_id UUID,  -- Reference to part3_content
    transcript TEXT,
    started_at TIMESTAMPTZ NOT NULL,
    ended_at TIMESTAMPTZ,
    duration_seconds INTEGER,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'error')),
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_exam_questions_level_part ON exam_questions(level, part, is_active);
CREATE INDEX idx_exam_part2_level ON exam_part2_content(level, is_active);
CREATE INDEX idx_exam_part3_level ON exam_part3_content(level, is_active);
CREATE INDEX idx_conversation_sessions_user ON conversation_sessions(user_id);

-- RLS policies
ALTER TABLE exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_part2_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_part3_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_sessions ENABLE ROW LEVEL SECURITY;

-- Public read for exam content
CREATE POLICY "Public exam content" ON exam_questions FOR SELECT USING (is_active = true);
CREATE POLICY "Public part2 content" ON exam_part2_content FOR SELECT USING (is_active = true);
CREATE POLICY "Public part3 content" ON exam_part3_content FOR SELECT USING (is_active = true);

-- Users own their conversation sessions
CREATE POLICY "Users own sessions" ON conversation_sessions 
  FOR ALL USING (auth.uid() = user_id);

-- Function to increment usage count
CREATE OR REPLACE FUNCTION increment_usage_count(p_table TEXT, p_ids UUID[])
RETURNS VOID AS $$
BEGIN
  EXECUTE format('UPDATE %I SET usage_count = usage_count + 1 WHERE id = ANY($1)', p_table)
  USING p_ids;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Edge Functions (for secure TTS caching)**

```sql
-- ============================================
-- EDGE FUNCTIONS (for secure TTS caching)
-- ============================================

-- Function: generate-and-cache-audio (Deno runtime)
-- Invoked from client after on-demand TTS generation
-- Uploads audio, returns URL, updates DB row
-- (Implement in Supabase Dashboard > Functions)
```

(You would then paste the Deno code from my previous response into the actual Supabase function editor.)

### 4.7.9 Client Service Updates

Update the client to call Edge Functions instead of direct API calls:

```typescript
// src/services/api/voiceApi.ts
import { supabase } from '../supabase/client';

const FUNCTIONS_URL = process.env.EXPO_PUBLIC_SUPABASE_URL + '/functions/v1';

export async function textToSpeech(text: string): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  
  const response = await fetch(`${FUNCTIONS_URL}/voice-tts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`,
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error('TTS failed');
  }

  const { audio } = await response.json();
  
  // Convert base64 to local file
  const audioPath = `${FileSystem.cacheDirectory}tts_${Date.now()}.mp3`;
  await FileSystem.writeAsStringAsync(audioPath, audio, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return audioPath;
}

export async function speechToText(audioUri: string): Promise<{ text: string }> {
  const { data: { session } } = await supabase.auth.getSession();
  
  const formData = new FormData();
  formData.append('audio', {
    uri: audioUri,
    type: 'audio/m4a',
    name: 'recording.m4a',
  } as any);

  const response = await fetch(`${FUNCTIONS_URL}/voice-stt`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session?.access_token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('STT failed');
  }

  return response.json();
}

export async function getAgentSession(level: string, part3ContentId: string) {
  const { data: { session } } = await supabase.auth.getSession();
  
  const response = await fetch(`${FUNCTIONS_URL}/voice-agent-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`,
    },
    body: JSON.stringify({ level, part3ContentId }),
  });

  if (!response.ok) {
    throw new Error('Failed to get agent session');
  }

  return response.json();
}

export async function fetchExamContent(level: string) {
  const { data: { session } } = await supabase.auth.getSession();
  
  const response = await fetch(`${FUNCTIONS_URL}/exam-content`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`,
    },
    body: JSON.stringify({ level }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch exam content');
  }

  return response.json();
}
```

---

## 5. Scoring & Grading System (LLM-Based)

### 5.1 Overview

The scoring system combines **STT confidence analysis** for pronunciation with **LLM structured outputs** for all other criteria. Scoring is **level-adjusted** - the same response would score differently for B2 vs C2.

```
User Audio Recording
    ↓
ElevenLabs STT (with word-level confidence)
    ↓
┌─────────────────────────────────────────────┐
│ Pronunciation Analysis                       │
│ - Words with low confidence → flagged        │
│ - Unusual phoneme patterns → flagged         │
│ - Hesitations/restarts tracked               │
└─────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────┐
│ LLM Analysis (GPT-4o-mini)                   │
│ - Level-specific prompts (B2/C1/C2)          │
│ - Structured JSON output                     │
│ - Grammar, Vocabulary, Discourse, Interaction│
└─────────────────────────────────────────────┘
    ↓
Score Normalization → Cambridge Scale
    ↓
Feedback Generation
```

### 5.2 Pronunciation Scoring (STT-Based)

ElevenLabs STT returns word-level confidence scores. We use these to detect pronunciation issues:

```typescript
interface STTResult {
  transcript: string;
  words: WordResult[];
  confidence: number;  // Overall 0-1
}

interface WordResult {
  word: string;
  start: number;      // Timestamp
  end: number;
  confidence: number; // 0-1 per word
}

// Pronunciation analysis
function analyzePronunciation(sttResult: STTResult, level: ExamLevel): PronunciationScore {
  const flaggedWords: FlaggedWord[] = [];

  // Confidence thresholds vary by level
  const threshold = CONFIDENCE_THRESHOLDS[level];

  for (const word of sttResult.words) {
    if (word.confidence < threshold.flag) {
      flaggedWords.push({
        word: word.word,
        confidence: word.confidence,
        severity: word.confidence < threshold.severe ? 'severe' : 'minor',
        timestamp: word.start,
      });
    }
  }

  // Calculate pronunciation score (0-5 Cambridge scale)
  const errorRate = flaggedWords.length / sttResult.words.length;
  const score = calculatePronunciationBand(errorRate, level);

  return {
    score,
    flaggedWords,
    overallClarity: sttResult.confidence,
    feedback: generatePronunciationFeedback(flaggedWords, level),
  };
}

// Thresholds by level (higher levels = stricter)
const CONFIDENCE_THRESHOLDS = {
  B2: { flag: 0.70, severe: 0.50 },  // More lenient
  C1: { flag: 0.75, severe: 0.55 },
  C2: { flag: 0.80, severe: 0.60 },  // Strictest
};
```

**What gets flagged:**
- Words with low STT confidence (mispronounced/unclear)
- Unusual pauses mid-word (hesitation)
- Repeated words/false starts
- Non-native stress patterns (detected via timing)

### 5.3 LLM Grading with Structured Outputs

We use **level-specific prompts** with **JSON structured outputs** for consistent scoring:

```typescript
interface GradingRequest {
  level: ExamLevel;
  part: ExamPart;
  transcript: string;
  examinerPrompts: string[];  // What was asked
  duration: number;
  targetDuration: number;
}

interface GradingResponse {
  scores: {
    grammar: number;           // 0-5
    vocabulary: number;        // 0-5
    discourse: number;         // 0-5
    interaction: number;       // 0-5
    globalAchievement: number; // 0-5
  };
  analysis: {
    grammarErrors: GrammarError[];
    vocabularyNotes: VocabNote[];
    discourseAnalysis: string;
    interactionAnalysis: string;
  };
  feedback: {
    strengths: string[];
    improvements: string[];
    examplePhrases: string[];
  };
}
```

### 5.4 Level-Specific Prompts

**The key insight:** A B2 candidate saying "I think it's good" is acceptable. A C2 candidate should say "I would argue that it's beneficial" - same meaning, different expectations.

```typescript
const GRADING_PROMPTS = {
  B2: {
    system: `You are a Cambridge B2 First speaking examiner.
Score based on B2 CEFR expectations:

GRAMMAR (B2 expectations):
- Can use a range of simple and some complex structures
- Errors occur but rarely impede communication
- Good control of common patterns
- Some errors in less common structures acceptable

VOCABULARY (B2 expectations):
- Good range for familiar topics
- Can paraphrase when lacking exact word
- Some inappropriate word choices acceptable
- Common collocations expected

DISCOURSE (B2 expectations):
- Can link ideas into connected speech
- Uses basic cohesive devices (however, although, etc.)
- Contributions relevant but may lack depth
- Some hesitation acceptable

INTERACTION (B2 expectations):
- Can initiate, maintain, and end conversation
- Can express agreement/disagreement politely
- May need occasional prompting
- Turn-taking generally appropriate

Score 0-5 where:
- 5 = Exceeds B2 expectations (approaching C1)
- 4 = Fully meets B2 expectations
- 3 = Meets most B2 expectations
- 2 = Below B2, some B1 features
- 1 = Significantly below B2
- 0 = No assessable language`,

    user: (transcript: string, context: string) => `
Exam Part: ${context}
Candidate Response: "${transcript}"

Evaluate this B2 First candidate. Return JSON:
{
  "scores": {
    "grammar": <0-5>,
    "vocabulary": <0-5>,
    "discourse": <0-5>,
    "interaction": <0-5>,
    "globalAchievement": <0-5>
  },
  "analysis": {
    "grammarErrors": [{"error": "...", "correction": "...", "severity": "minor|major"}],
    "vocabularyNotes": [{"used": "...", "betterOption": "...", "why": "..."}],
    "discourseAnalysis": "...",
    "interactionAnalysis": "..."
  },
  "feedback": {
    "strengths": ["...", "..."],
    "improvements": ["...", "..."],
    "examplePhrases": ["..."]
  }
}`
  },

  C1: {
    system: `You are a Cambridge C1 Advanced speaking examiner.
Score based on C1 CEFR expectations:

GRAMMAR (C1 expectations):
- Wide range of complex structures with flexibility
- Errors rare and difficult to spot
- Good control of complex grammar throughout
- Can reformulate without losing fluency

VOCABULARY (C1 expectations):
- Good command of broad lexical repertoire
- Can use idiomatic expressions naturally
- Precise vocabulary choices
- Can vary formulation to avoid repetition

DISCOURSE (C1 expectations):
- Well-structured, clear, detailed speech
- Effective use of organizational patterns
- Smooth flow with effective cohesion
- Can develop arguments systematically

INTERACTION (C1 expectations):
- Natural, fluent interaction
- Can relate contributions skillfully to others
- Can use language flexibly for social purposes
- Effective turn-taking with no awkwardness

Score 0-5 where:
- 5 = Exceeds C1 expectations (approaching C2)
- 4 = Fully meets C1 expectations
- 3 = Meets most C1 expectations
- 2 = Below C1, some B2 features
- 1 = Significantly below C1
- 0 = No assessable language`,
    // ... similar user prompt
  },

  C2: {
    system: `You are a Cambridge C2 Proficiency speaking examiner.
Score based on C2 CEFR expectations:

GRAMMAR (C2 expectations):
- Complete grammatical control at all times
- Maintains consistent accuracy of complex language
- Errors extremely rare and hard to identify
- Full range of structures used appropriately

VOCABULARY (C2 expectations):
- Very broad lexical repertoire including idiomatic/colloquial
- Consistent accuracy in word choice
- Can convey finer shades of meaning precisely
- Natural use of less common vocabulary

DISCOURSE (C2 expectations):
- Creates coherent, cohesive discourse effortlessly
- Sophisticated organizational patterns
- Effective rhetorical devices
- Can adjust style and tone flexibly

INTERACTION (C2 expectations):
- Interacts with complete fluency and spontaneity
- Effortless turn-taking
- Can backtrack and restructure seamlessly
- Precise communication of subtle attitudes

Score 0-5 where:
- 5 = Native-like proficiency
- 4 = Fully meets C2 expectations
- 3 = Meets most C2 expectations
- 2 = Below C2, some C1 features
- 1 = Significantly below C2
- 0 = No assessable language`,
    // ... similar user prompt
  }
};
```

### 5.5 Cambridge Scale Conversion

Cambridge uses a unified scale (80-230) across exams. Each level has pass thresholds:

| Level | Scale Range | Pass (Grade C) | Grade B | Grade A |
|-------|-------------|----------------|---------|---------|
| **B2 First** | 140-190 | 160 | 173 | 180 |
| **C1 Advanced** | 160-210 | 180 | 193 | 200 |
| **C2 Proficiency** | 180-230 | 200 | 213 | 220 |

**Score Capping Logic:**

A B2 candidate cannot score above the B2 ceiling (190). If they're consistently scoring 5/5, we suggest they try C1:

```typescript
interface FinalScore {
  // Raw 0-5 scores
  rawScores: ExamScores;

  // Weighted average (0-5)
  averageScore: number;

  // Cambridge Scale score
  cambridgeScale: number;

  // Grade
  grade: 'Fail' | 'C' | 'B' | 'A' | 'Above Level';

  // Recommendation
  recommendation?: string;
}

function calculateFinalScore(
  rawScores: ExamScores,
  pronunciationScore: number,
  level: ExamLevel
): FinalScore {
  // Combine all scores
  const allScores = {
    ...rawScores,
    pronunciation: pronunciationScore,
  };

  // Weighted average (Cambridge weights)
  const weights = {
    grammar: 0.20,
    vocabulary: 0.20,
    discourse: 0.20,
    pronunciation: 0.15,
    interaction: 0.15,
    globalAchievement: 0.10,
  };

  const averageScore = Object.entries(allScores).reduce(
    (sum, [key, value]) => sum + (value * weights[key]),
    0
  );

  // Convert to Cambridge Scale
  const scaleConfig = CAMBRIDGE_SCALE[level];
  const cambridgeScale = mapToCambridgeScale(averageScore, scaleConfig);

  // Determine grade
  const grade = determineGrade(cambridgeScale, scaleConfig);

  // Check if scoring above level
  let recommendation: string | undefined;
  if (averageScore >= 4.5 && grade === 'A') {
    const nextLevel = getNextLevel(level);
    if (nextLevel) {
      recommendation = `Excellent performance! Consider practicing at ${nextLevel} level.`;
    }
  }

  return {
    rawScores: allScores,
    averageScore,
    cambridgeScale,
    grade,
    recommendation,
  };
}

const CAMBRIDGE_SCALE = {
  B2: { min: 140, max: 190, pass: 160, gradeB: 173, gradeA: 180 },
  C1: { min: 160, max: 210, pass: 180, gradeB: 193, gradeA: 200 },
  C2: { min: 180, max: 230, pass: 200, gradeB: 213, gradeA: 220 },
};

function mapToCambridgeScale(avgScore: number, config: ScaleConfig): number {
  // Map 0-5 average to Cambridge Scale range
  // avgScore 2.5 (bare pass) → config.pass
  // avgScore 5.0 → config.max
  // avgScore 0 → config.min

  const scoreRatio = avgScore / 5;
  const scaleRange = config.max - config.min;

  return Math.round(config.min + (scoreRatio * scaleRange));
}
```

### 5.6 Structured Output Schema

Using OpenAI's structured outputs for consistent LLM responses:

```typescript
const GRADING_SCHEMA = {
  name: "exam_grading",
  strict: true,
  schema: {
    type: "object",
    properties: {
      scores: {
        type: "object",
        properties: {
          grammar: { type: "number", minimum: 0, maximum: 5 },
          vocabulary: { type: "number", minimum: 0, maximum: 5 },
          discourse: { type: "number", minimum: 0, maximum: 5 },
          interaction: { type: "number", minimum: 0, maximum: 5 },
          globalAchievement: { type: "number", minimum: 0, maximum: 5 },
        },
        required: ["grammar", "vocabulary", "discourse", "interaction", "globalAchievement"],
      },
      analysis: {
        type: "object",
        properties: {
          grammarErrors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                error: { type: "string" },
                correction: { type: "string" },
                explanation: { type: "string" },
                severity: { type: "string", enum: ["minor", "major"] },
              },
              required: ["error", "correction", "severity"],
            },
          },
          vocabularyNotes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                used: { type: "string" },
                suggestion: { type: "string" },
                context: { type: "string" },
              },
              required: ["used", "suggestion"],
            },
          },
          discourseAnalysis: { type: "string" },
          interactionAnalysis: { type: "string" },
        },
        required: ["grammarErrors", "vocabularyNotes", "discourseAnalysis", "interactionAnalysis"],
      },
      feedback: {
        type: "object",
        properties: {
          summary: { type: "string" },
          strengths: { type: "array", items: { type: "string" } },
          improvements: { type: "array", items: { type: "string" } },
          examplePhrases: { type: "array", items: { type: "string" } },
        },
        required: ["summary", "strengths", "improvements"],
      },
    },
    required: ["scores", "analysis", "feedback"],
  },
};

// API call with structured output
async function gradeTranscript(
  transcript: string,
  level: ExamLevel,
  part: ExamPart,
  context: string
): Promise<GradingResponse> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: GRADING_PROMPTS[level].system },
      { role: "user", content: GRADING_PROMPTS[level].user(transcript, context) },
    ],
    response_format: {
      type: "json_schema",
      json_schema: GRADING_SCHEMA,
    },
  });

  return JSON.parse(response.choices[0].message.content);
}
```

### 5.7 Level Expectations Summary

| Criterion | B2 Expectation | C1 Expectation | C2 Expectation |
|-----------|---------------|----------------|----------------|
| **Grammar** | Some complex structures, occasional errors OK | Wide range, rare errors | Complete control, no errors |
| **Vocabulary** | Good range for familiar topics | Broad repertoire + idioms | Very broad + precise nuance |
| **Discourse** | Connected speech, basic connectors | Well-structured, effective cohesion | Effortless, sophisticated |
| **Pronunciation** | Intelligible, some L1 influence OK | Clear, appropriate stress | Native-like clarity |
| **Interaction** | Can maintain conversation | Natural, flexible | Effortless, subtle |

### 5.8 Feedback Presentation (Premium vs Free)

**Free Trial:** Grade only, no details
```
┌─────────────────────────────────────────────────────┐
│ Your Score: 168 (B2 Grade C - Pass)                 │
│                                                     │
│ ████████████████░░░░░░░░░░░░░░  168/190            │
│                                                     │
│ 🔒 Detailed feedback available with Premium         │
│    • See your grammar mistakes                     │
│    • Get vocabulary suggestions                    │
│    • Pronunciation analysis                        │
│                                                     │
│ [Unlock Premium]                                    │
└─────────────────────────────────────────────────────┘
```

**Premium:** Full breakdown
```
┌─────────────────────────────────────────────────────┐
│ Your Score: 168 (B2 Grade C - Pass)                 │
│                                                     │
│ Grammar & Vocabulary  ████████░░  3.5/5            │
│ Discourse Management  █████████░  4.0/5            │
│ Pronunciation         ███████░░░  3.0/5            │
│ Interactive Comm.     ████████░░  3.5/5            │
│ Global Achievement    ████████░░  3.5/5            │
│                                                     │
│ ─────────────────────────────────────────────────  │
│                                                     │
│ ✅ Strengths:                                       │
│ • Good use of linking words (however, although)    │
│ • Relevant responses to all questions              │
│                                                     │
│ ⚠️ Areas to Improve:                               │
│ • Grammar: "If I would have" → "If I had"          │
│ • Vocabulary: Try "beneficial" instead of "good"   │
│ • Pronunciation: "comfortable" - stress on 1st     │
│                                                     │
│ 💡 Example phrases for next time:                   │
│ • "From my perspective..."                         │
│ • "That's an interesting point, however..."        │
└─────────────────────────────────────────────────────┘
```

---

## 6. Database Schema (Supabase)

```sql
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS & AUTH
-- ============================================

CREATE TABLE profiles (
    id UUID REFERENCES auth.users PRIMARY KEY,
    display_name TEXT,
    avatar_url TEXT,

    -- Auth type
    auth_type TEXT CHECK (auth_type IN ('anonymous', 'email', 'oauth', 'academy_invite')),

    -- Academy (B2B)
    academy_id UUID REFERENCES academies(id),
    academy_group_id UUID,

    -- Onboarding state
    onboarding_complete BOOLEAN DEFAULT false,
    has_used_free_trial BOOLEAN DEFAULT false,

    -- Exam planning
    target_exam_level TEXT CHECK (target_exam_level IN ('B2', 'C1', 'C2')),
    target_exam_date DATE,
    daily_practice_goal INTEGER DEFAULT 45,

    -- Notifications
    notification_preferences JSONB DEFAULT '{"streakReminders": true, "reminderTime": "18:00"}',

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ACADEMIES (B2B)
-- ============================================

CREATE TABLE academies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    subscription_tier TEXT DEFAULT 'basic',
    max_students INTEGER DEFAULT 50,
    admin_emails TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- GAMIFICATION
-- ============================================

-- Daily activity for contributions graph
CREATE TABLE daily_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    minutes_practiced INTEGER DEFAULT 0,
    sessions_completed INTEGER DEFAULT 0,
    xp_earned INTEGER DEFAULT 0,

    UNIQUE(user_id, date)
);

-- User progress & stats
CREATE TABLE user_progress (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,

    -- XP & Levels
    total_xp INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,

    -- Streaks
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_practice_date DATE,
    streak_freezes_available INTEGER DEFAULT 0,

    -- Overall stats
    total_sessions INTEGER DEFAULT 0,
    total_practice_minutes INTEGER DEFAULT 0,
    average_score DECIMAL(2,1) DEFAULT 0,

    -- Per-level stats
    level_stats JSONB DEFAULT '{
        "B2": {"sessions": 0, "avgScore": 0, "partScores": {"part1": 0, "part2": 0, "part3": 0, "part4": 0}},
        "C1": {"sessions": 0, "avgScore": 0, "partScores": {"part1": 0, "part2": 0, "part3": 0, "part4": 0}},
        "C2": {"sessions": 0, "avgScore": 0, "partScores": {"part1": 0, "part2": 0, "part3": 0}}
    }',

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Achievements
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,
    category TEXT CHECK (category IN ('streak', 'sessions', 'level', 'score', 'time', 'special')),
    tier TEXT CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
    criteria JSONB NOT NULL,
    xp_reward INTEGER DEFAULT 0,
    is_secret BOOLEAN DEFAULT false
);

CREATE TABLE user_achievements (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    unlocked_at TIMESTAMPTZ,
    PRIMARY KEY (user_id, achievement_id)
);

-- ============================================
-- EXAM SESSIONS
-- ============================================

CREATE TABLE exam_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

    -- Exam info
    level TEXT NOT NULL CHECK (level IN ('B2', 'C1', 'C2')),
    session_type TEXT NOT NULL CHECK (session_type IN ('full_exam', 'single_part')),
    parts_practiced TEXT[] NOT NULL,

    -- Status
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    is_free_trial BOOLEAN DEFAULT false,

    -- Timing
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    duration_seconds INTEGER,

    -- Scores (Cambridge 0-5 scale)
    overall_score DECIMAL(2,1),
    scores JSONB, -- {grammar, vocabulary, discourse, pronunciation, interaction, globalAchievement}

    -- Gamification
    xp_earned INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual part results
CREATE TABLE exam_part_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES exam_sessions(id) ON DELETE CASCADE,

    -- Part info
    part TEXT NOT NULL CHECK (part IN ('part1', 'part2', 'part3', 'part4')),
    content_id UUID REFERENCES exam_content(id),

    -- Audio & transcript
    audio_url TEXT,
    user_transcript TEXT,
    ai_transcript TEXT,

    -- Timing
    duration_seconds INTEGER,
    target_duration_seconds INTEGER,

    -- Scores & feedback
    scores JSONB,
    feedback JSONB,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EXAM CONTENT
-- ============================================

CREATE TABLE exam_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Classification
    level TEXT NOT NULL CHECK (level IN ('B2', 'C1', 'C2')),
    part TEXT NOT NULL CHECK (part IN ('part1', 'part2', 'part3', 'part4')),
    topic TEXT NOT NULL,
    difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 3),

    -- Content (structure varies by part)
    content JSONB NOT NULL,

    -- Metadata
    usage_count INTEGER DEFAULT 0,
    average_score DECIMAL(2,1),
    is_active BOOLEAN DEFAULT true,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Add for lazy audio caching (or add to exam_questions / exam_part2_content / exam_part3_content if using normalized schema)
    audio_url TEXT,                          -- Public/signed URL to cached MP3 in Storage
    audio_generated_at TIMESTAMPTZ           -- Timestamp for potential invalidation/refresh
);

-- ============================================
-- EDGE FUNCTIONS (for secure TTS caching)
-- ============================================

-- Function: generate-and-cache-audio (Deno runtime)
-- Invoked from client after on-demand TTS generation
-- Uploads audio, returns URL, updates DB row
-- (Implement in Supabase Dashboard > Functions)

-- ============================================
-- SUBSCRIPTIONS
-- ============================================

CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,

    -- RevenueCat data
    revenuecat_user_id TEXT,
    product_id TEXT,
    entitlement TEXT,

    -- Status
    status TEXT CHECK (status IN ('active', 'expired', 'cancelled', 'trial')),
    started_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_daily_activity_user_date ON daily_activity(user_id, date DESC);
CREATE INDEX idx_exam_sessions_user ON exam_sessions(user_id, created_at DESC);
CREATE INDEX idx_exam_content_level_part ON exam_content(level, part);
CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_part_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users own data" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users own progress" ON user_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own activity" ON daily_activity FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own sessions" ON exam_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own results" ON exam_part_results FOR ALL
    USING (session_id IN (SELECT id FROM exam_sessions WHERE user_id = auth.uid()));
CREATE POLICY "Users own achievements" ON user_achievements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own subscription" ON subscriptions FOR ALL USING (auth.uid() = user_id);

-- Public read for content
CREATE POLICY "Public content" ON exam_content FOR SELECT USING (is_active = true);
CREATE POLICY "Public achievements" ON achievements FOR SELECT USING (true);
```

---

## 7. Gamification System

### 7.1 Contributions Graph (GitHub-style)

```typescript
interface ContributionsData {
  // 52 weeks × 7 days
  days: DayActivity[];
}

interface DayActivity {
  date: string;              // YYYY-MM-DD
  minutesPracticed: number;
  sessionsCompleted: number;
  level: 0 | 1 | 2 | 3 | 4;  // Intensity for color
}

// Level calculation:
// 0 = no activity (gray)
// 1 = 1-10 minutes (light green)
// 2 = 11-25 minutes (medium green)
// 3 = 26-40 minutes (green)
// 4 = 41-45 minutes (dark green - max!)
```

**Visual:**

Focused on the timeframe close to the exam, to maximize how much the user feels they have contributed. It can show the whole year or YTD or year-to-exam or different periods.

```
┌─────────────────────────────────────────────────────┐
│ Your Practice Activity                              │
│                                                     │
│ Jan  Feb  Mar  Apr  May  Jun  Jul  Aug  Sep  Oct   │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│ ░░░░░░░░░█░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│ ░░░░░░░░░██░░░░░█░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│ ░░░░░░░░████░░░███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│ ░░░░░░░█████░░████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│ ░░░░░░░████░░░███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│ ░░░░░░░░██░░░░░█░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                                     │
│ 47 days practiced  •  12 day streak  •  23 hours   │
└─────────────────────────────────────────────────────┘
```

### 7.2 Streaks

```typescript
interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: Date;
  freezesAvailable: number;    // Premium feature
}

// Rules:
// - Any practice session counts (even 5 min)
// - Streak breaks at midnight local time
// - Freeze: skip 1 day without breaking (premium)
```

### 7.3 XP & Levels

```typescript
const XP_CONFIG = {
  // Base rewards
  fullExam: 100,
  singlePart: 30,
  dailyBonus: 20,        // First session of day

  // Score multipliers
  scoreExcellent: 1.5,   // 4.5-5.0
  scoreGood: 1.2,        // 3.5-4.4
  scoreAverage: 1.0,     // 2.5-3.4

  // Streak multipliers
  streak7Days: 1.1,
  streak30Days: 1.25,
  streak100Days: 1.5,
};

// Level thresholds
const LEVELS = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  1000,   // Level 5
  1750,   // Level 6
  2750,   // Level 7
  4000,   // Level 8
  5500,   // Level 9
  7500,   // Level 10
  // ...exponential growth
];
```

### 7.4 Achievements

| Achievement | Criteria | XP Reward |
|-------------|----------|-----------|
| **First Steps** | Complete first session | 50 |
| **Week Warrior** | 7-day streak | 100 |
| **Month Master** | 30-day streak | 500 |
| **Century Club** | 100-day streak | 2000 |
| **Perfect Score** | Score 5.0 on any part | 200 |
| **Full House** | Complete all 4 parts in one session | 150 |
| **B2 Ready** | Average 4.0+ across all B2 parts | 500 |
| **C1 Ready** | Average 4.0+ across all C1 parts | 750 |
| **C2 Ready** | Average 4.0+ across all C2 parts | 1000 |
| **Early Bird** | Practice before 8am | 50 |
| **Night Owl** | Practice after 10pm | 50 |
| **Marathon** | 45 min practice in one day | 100 |

---

## 8. Practice Plan System

### 8.1 Exam Countdown

```typescript
interface PracticePlan {
  userId: string;
  targetExamDate: Date;
  targetLevel: ExamLevel;

  // Calculated
  daysUntilExam: number;
  recommendedDailyMinutes: number;  // Max 45
  overallProgress: number;          // 0-100%

  // Weak areas (auto-detected)
  weakParts: ExamPart[];
  weakCriteria: string[];           // e.g., "pronunciation"

  // Today
  todaysPlan: DailyPlan;
}

interface DailyPlan {
  date: Date;
  targetMinutes: number;
  completedMinutes: number;
  suggestedActivities: Activity[];
  isComplete: boolean;
}

interface Activity {
  type: 'full_exam' | 'single_part' | 'focus_drill';
  part?: ExamPart;
  estimatedMinutes: number;
  reason: string;  // "Focus on your weakest area"
  priority: 1 | 2 | 3;
}
```

### 8.2 45-Minute Daily Cap

```typescript
const DAILY_LIMIT = 45; // minutes

function canStartSession(todayMinutes: number, estimate: number) {
  if (todayMinutes >= DAILY_LIMIT) {
    return {
      allowed: false,
      message: "You've hit today's 45-minute limit! Rest up and come back tomorrow. Consistency beats cramming!"
    };
  }

  if (todayMinutes + estimate > DAILY_LIMIT) {
    return {
      allowed: true,
      warning: `${DAILY_LIMIT - todayMinutes} minutes left today.`
    };
  }

  return { allowed: true };
}
```

### 8.3 Practice Plan UI

```
┌─────────────────────────────────────────────────────┐
│ 📅 Your Exam: March 15, 2026                        │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                     │
│ 🔥 47 days to go                                    │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ ████████████████████░░░░░░░░░░░░  68% ready     │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ Today's Practice (32/45 min)                        │
│ ┌─────────────────────────────────────────────────┐ │
│ │ ✅ Part 1 Interview (10 min)                    │ │
│ │ ✅ Part 2 Long Turn (12 min)                    │ │
│ │ ⬜ Part 3 Collaborative (10 min)    [START]     │ │
│ │ ⬜ Part 4 Discussion (13 min)                   │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ ⚠️ Focus Areas:                                     │
│ • Part 3 (Collaborative) - Score: 3.2              │
│ • Pronunciation - Needs improvement                │
└─────────────────────────────────────────────────────┘
```

---

## 9. Recording Playback & Session History

### 9.1 Storage Limits

**Only the last 5 exam sessions are stored** to reduce scope and storage costs.

```typescript
interface SessionRecording {
  id: string;
  sessionId: string;
  part: ExamPart;
  audioUrl: string;          // Supabase Storage
  transcript: string;
  duration: number;
  createdAt: Date;
}

// Storage: exam-recordings/{user_id}/{session_id}/{part}.m4a
// Retention: Last 5 sessions only
// Cleanup: Auto-delete oldest when 6th is created

const MAX_STORED_SESSIONS = 5;

async function cleanupOldSessions(userId: string): Promise<void> {
  const sessions = await getSessionsOrderedByDate(userId);
  if (sessions.length > MAX_STORED_SESSIONS) {
    const toDelete = sessions.slice(MAX_STORED_SESSIONS);
    await deleteSessionsAndRecordings(toDelete);
  }
}
```

### 9.2 Session Lookup

Sessions are found by **date, time, and grade** - not a scrollable infinite list:

```typescript
interface SessionFilter {
  dateRange?: { start: Date; end: Date };
  grade?: 'A' | 'B' | 'C' | 'Fail' | 'Unfinished';
}

// Display format: "Jan 4, 2026 at 14:30 • Grade B (172)"
```

### 9.3 Interrupted/Unfinished Sessions

If an exam is interrupted mid-session:
- Marked as **"Unfinished"** (not graded)
- Time spent **still counts toward 45-min daily cap**
- Shown in history with distinct styling
- Cannot be resumed (must start new session)

```typescript
interface ExamSession {
  // ...existing fields
  status: 'in_progress' | 'completed' | 'unfinished';
  interruptedAt?: Date;        // When it was abandoned
  interruptedDuringPart?: ExamPart;
}
```

**UI:**
```
┌─────────────────────────────────────────────────────┐
│ Past Sessions (Last 5)                              │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Jan 4, 2026 at 14:30 • B2 First                 │ │
│ │ Grade B (172)                                   │ │
│ │ [▶ Part 1] [▶ Part 2] [▶ Part 3] [▶ Part 4]   │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Jan 3, 2026 at 09:15 • B2 First                 │ │
│ │ ⚠️ Unfinished (interrupted at Part 2)           │ │
│ │ [▶ Part 1]                                      │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Jan 2, 2026 at 18:45 • B2 First                 │ │
│ │ Grade C (165)                                   │ │
│ │ [▶ Part 1] [▶ Part 2] [▶ Part 3] [▶ Part 4]   │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

## 10. Notification System

```typescript
interface NotificationPreferences {
  streakReminders: boolean;
  reminderTime: string;        // "18:00"
  practiceComplete: boolean;
  weeklyProgress: boolean;
  examCountdown: boolean;      // 30, 14, 7, 1 day milestones
}

// Notification triggers:
// 1. Streak at risk (evening, hasn't practiced)
// 2. Streak broken (encouraging tone)
// 3. Daily goal complete
// 4. Achievement unlocked
// 5. Exam countdown milestones
// 6. Weekly progress summary
```

**Implementation:**
- Expo Notifications for push
- Supabase Edge Functions + pg_cron for scheduling
- Deep linking to relevant screens

---

## 11. Subscription & Monetization

### 11.1 Tiers

| Feature | Free (Trial) | Premium |
|---------|--------------|---------|
| Access | 1 free exam | Unlimited |
| Feedback | Grade only | Detailed + corrections |
| Exam Levels | B2 only | B2, C1, C2 |
| Daily Limit | N/A | 45 min/day |
| Progress | None | Full history + graph |
| Practice Plan | None | Personalized |
| Streaks | None | Full system |
| Recordings | Not saved | Cloud storage + playback |
| Streak Freezes | None | 2 per month |

### 11.2 Pricing

- **Monthly:** $9.99/month
- **Yearly:** $79.99/year (33% off)
- **Academy:** Custom pricing per student

### 11.3 RevenueCat Integration

```typescript
const ENTITLEMENTS = {
  PREMIUM: 'premium',
};

const PRODUCTS = {
  MONTHLY: 'mintzo_monthly',
  YEARLY: 'mintzo_yearly',
};

// Feature gating
function useEntitlements() {
  const isPremium = checkEntitlement(ENTITLEMENTS.PREMIUM);

  return {
    isPremium,
    canAccessLevel: (level) => isPremium || level === 'B2',
    canAccessFullFeedback: isPremium,
    dailySessionsRemaining: isPremium ? Infinity : 0,
    canSaveRecordings: isPremium,
  };
}
```

---

## 12. Implementation Phases

### Phase 1: Foundation
- [ ] Initialize Expo project with TypeScript (`npx create-expo-app@latest --template blank-typescript`)
- [ ] Set up folder structure per Section 4.3
- [ ] Install ElevenLabs dependencies (see Section 4.4.1):
  ```bash
  npx expo install @elevenlabs/react-native @livekit/react-native @livekit/react-native-webrtc @config-plugins/react-native-webrtc @livekit/react-native-expo-plugin livekit-client
  ```
- [ ] Create `.npmrc` with `legacy-peer-deps=true`
- [ ] Configure `app.json` with:
  - [ ] iOS microphone permissions (`NSMicrophoneUsageDescription`)
  - [ ] Android audio permissions (RECORD_AUDIO, MODIFY_AUDIO_SETTINGS, etc.)
  - [ ] Expo plugins: `@livekit/react-native-expo-plugin`, `@config-plugins/react-native-webrtc`
- [ ] Configure Supabase (auth, database, storage)
- [ ] Configure Supabase DB Schema using Supabase MCP server
- [ ] Create `.env` and `.env.example` with all ElevenLabs agent IDs and API keys
- [ ] Wrap app with `ElevenLabsProvider` in root layout
- [ ] Implement dual onboarding flows (self-signup + academy invite)
- [ ] Basic navigation structure (Expo Router)
- [ ] UI component library (NativeWind)
- [ ] Authentication flows
- [ ] Create Readme.md with comprehensive documentation
- [ ] Test development build setup: `npx expo prebuild --clean`

### Phase 2: Core Exam Experience (ElevenLabs Integration)
- [ ] **ElevenLabs Agent Setup (ElevenLabs Dashboard)**:
  - [ ] Create B2 Part 1 agent (Interview) with Cambridge examiner persona
  - [ ] Create B2 Part 3 agent (Collaborative Task)
  - [ ] Create B2 Part 4 agent (Discussion)
  - [ ] Create C1 Part 1, 3, 4 agents
  - [ ] Create C2 Part 1, 2, 3 agents
  - [ ] Configure dynamic variables for each agent (platform, examLevel, examPart)
  - [ ] Select appropriate British English voice for each agent
  - [ ] Enable conversation transcription on all agents
- [ ] **React Native Implementation**:
  - [ ] Implement `useConversationalAI` hook (Section 4.4.5)
  - [ ] Implement `ConversationScreen` component (Section 4.4.6)
  - [ ] Implement `BreathingOrb` animation component (Section 4.4.7)
  - [ ] Implement conversation error handling and retry logic (Section 4.4.10)
- [ ] **Part-Specific Screens**:
  - [ ] Part 1 (Interview) - conversational flow with orb UI
  - [ ] Part 2 (Long Turn) - photo display + local recording + ElevenLabs STT + grading
  - [ ] Parts 3 & 4 - conversational flows with orb UI
- [ ] **Scoring & Results**:
  - [ ] Implement transcript capture from conversation sessions
  - [ ] Basic scoring with GPT-4o-mini structured outputs
  - [ ] Results screen with feedback
- [ ] **Testing**:
  - [ ] Test on physical iOS device (`npx expo run:ios --device`)
  - [ ] Test on physical Android device (`npx expo run:android --device`)
  - [ ] Verify WebRTC connection stability
  - [ ] Test conversation flow end-to-end

### Phase 3: Gamification
- [ ] Contributions graph component
- [ ] Streak system with daily tracking
- [ ] XP and levels system
- [ ] Achievements system (15-20 achievements)
- [ ] Progress statistics screens

### Phase 4: Practice Plan
- [ ] Exam countdown component
- [ ] Daily plan generation algorithm
- [ ] 45-minute cap enforcement
- [ ] Weak area detection
- [ ] Progress tracking visualization

### Phase 5: Monetization & Polish
- [ ] RevenueCat integration
- [ ] Paywall UI
- [ ] Free trial flow (grade only)
- [ ] Feature gating implementation
- [ ] Recording playback feature
- [ ] Notification system

### Phase 6: Content & Launch
- [ ] Populate exam content database
- [ ] Part 2 photo assets
- [ ] Testing across devices
- [ ] Performance optimization
- [ ] App store assets
- [ ] Beta testing (TestFlight/Play Store)

---

## 13. Critical Files to Implement First

1. **`/app/_layout.tsx`**
   - Root layout with `ElevenLabsProvider` wrapper
   - Required for all conversation functionality

2. **`/src/features/voice/hooks/useConversationalAI.ts`**
   - Core ElevenLabs conversation hook
   - Wraps `useConversation` with Mintzo-specific logic
   - Manages agent selection, dynamic variables, transcript capture

3. **`/src/components/exam/ConversationScreen.tsx`**
   - Main conversation UI during exam
   - Immersive, distraction-free design

4. **`/src/components/exam/BreathingOrb.tsx`**
   - Visual feedback during conversation
   - Animated orb with speaking/listening states

5. **`/app/(onboarding)/`**
   - User acquisition funnel
   - Critical for conversion

6. **`/src/components/gamification/ContributionsGraph.tsx`**
   - Key differentiator UI
   - High engagement feature

7. **`/src/features/scoring/services/gradingEngine.ts`**
   - Cambridge criteria implementation
   - LLM prompt engineering

8. **`/app/exam/session/[id].tsx`**
   - Main exam screen
   - Orchestrates all parts

---

## 14. External Resources

### Cambridge Official
- [B2 First Format](https://www.cambridgeenglish.org/exams-and-tests/qualifications/first/format/)
- [C1 Advanced Format](https://www.cambridgeenglish.org/exams-and-tests/qualifications/advanced/format/)
- [Assessment Scales PDF](https://www.cambridgeenglish.org/images/167865-cambridge-english-advanced-cae-speaking-assessment-scales.pdf)

### Technical Docs
- [ElevenLabs Conversational AI](https://elevenlabs.io/docs/conversational-ai)
- [ElevenLabs React Native SDK](https://elevenlabs.io/docs/agents-platform/libraries/react-native)
- [Supabase Docs](https://supabase.com/docs)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [RevenueCat React Native](https://www.revenuecat.com/docs/getting-started/installation/reactnative)

---

## 15. Key Decisions Summary

| Decision | Choice |
|----------|--------|
| Framework | React Native + Expo (managed) |
| Backend | Supabase |
| Speech AI | ElevenLabs (Conversational AI + STT) |
| Grading | GPT-4o-mini |
| Payments | RevenueCat |
| Academy Admin | Manual initially, portal post-MVP |
| Recordings | Saved to cloud, playback enabled |
| Notifications | Push + in-app, user-controlled |
| Daily Cap | 45 minutes maximum |
| Free Trial | 1 exam, grade only, no feedback |

---

## 17. Testing Strategy

After every minmal UI change you **must** run the dev server and search the web to ensure it matches the inspiration images and is consistent with the wished styling.

---

## 18. UI Design Inspiration

### 18.1 Primary Inspiration: Timespent

**App:** [Timespent - Activity Tracker](https://apps.apple.com/us/app/timespent-activity-tracker/id6742226600)

**Why this app inspires Mintzo:**

| Timespent Feature | Mintzo Application |
|-------------------|-------------------|
| **Clean, minimal interface** | Exam screens should be distraction-free |
| **Dark mode first** | Reduce eye strain during practice sessions |
| **Progress visualization** | Adapt their activity tracking to exam progress |
| **Flexible tracking** | Similar to how we track multiple exam parts |
| **Home screen widgets** | Show streak, daily progress, exam countdown |
| **Focus timer UX** | Inspiration for exam part timers |

**Design principles to adopt:**
1. **Simplicity over feature density** - One action per screen
2. **Progress always visible** - Never hide the user's achievement
3. **Dark theme default** - Modern, reduces fatigue
4. **Micro-interactions** - Celebrate small wins (XP pop, streak fire)
5. **Widget-first thinking** - Keep users engaged outside the app

### 18.2 Additional UI Inspiration

| App | Inspiration For |
|-----|-----------------|
|**timespent** | Gamification, streaks, XP animations, UI |
| **Notion** | Clean typography, content organization |

![alt text](<inspiration/timespent iOS 3.png>) ![alt text](<inspiration/timespent iOS 6.png>) ![alt text](<inspiration/timespent iOS 33.png>) ![alt text](<inspiration/timespent iOS 38.png>) ![alt text](<inspiration/timespent iOS 77.png>)


### 18.3 Mintzo Design System (Proposed)

**Color Palette:**
```
Base Colors:
Background:   #FFFFFF (White) - Main app background
Surface:      #FFFFFF (White) - Cards and modals
Text Primary: #000000 (Black) - Headings, main text
Text Sec.:    #64748B (Slate 500) - Subtitles, metadata
Border/Line:  #000000 (Black) - 2px stroke on cards/buttons

Activity Themes (Pastels):
Reading:      #FEF3C7 (Cream/Amber 100)
Running:      #D1FAE5 (Mint/Emerald 100)
General:      #F3F4F6 (Gray 100)
Highlight:    #E0E7FF (Indigo 100)

Accents & States:
Primary Brand: #7C3AED (Violet 600) - Active states, hard shadows
Success:       #4ADE80 (Green 400) - Checkmarks, completed goals
Gold/Star:     #FCD34D (Amber 300) - Favorites, milestones
Selected Date: #93C5FD (Blue 300) - Calendar selection
```

**Typography:**
```
Font Family:  SF Pro Rounded (iOS) / Nunito (Android equivalent)
Headings:     Bold / Heavy Weight
Body:         Regular / Medium

Sizes:
Display:      34px / 41px (Large Page Titles like "Activities")
H1:           22px / 28px (Card Titles, Month Names)
H2:           17px / 22px (List items, Button text)
Body:         15px / 20px (Quotes, descriptive text)
Caption:      13px / 18px (Metadata like "This Week", "9mi")
Small:        11px / 13px (Graph labels)
```

**Spacing (Standard 8pt Grid):**
```
xs:   4px
sm:   8px
md:   16px  (Standard content padding)
lg:   24px  (Section separation)
xl:   32px
2xl:  40px
```

**Border Radius:**
```
sm:   8px   (Inner elements, calendar days)
md:   16px  (Standard buttons, list items)
lg:   24px  (Activity cards, widgets)
xl:   32px  (Floating nav bars)
full: 9999px (Circular icons, avatars)
```

**UI Effects & Components:**
```
creamy colored - modern - neobrutalist - minimal UI - 
Borders:
Standard:     1.5px to 2px Solid #000000
Focus:        3px Solid #7C3AED

Shadows (Light neobrutalist style):
Card Shadow:  X: 0, Y: 4px, Blur: 0, Spread: 0, Color: #000000 (Black)
Active Drop:  X: 4px, Y: 4px, Blur: 0, Spread: 0, Color: #7C3AED (Violet)
Floating Nav: Soft drop shadow (standard iOS blur)

Calendar Grid:
Empty Day:    #F8F8F8 (Off-white square)
Filled Day:   #FDE68A (Pastel fill)
Checked Day:  #4ADE80 (Green fill with White tick)
```

### 18.4 Key Screen Concepts


**Exam Session Screen - Immersive Mode:**

### Key UX Principles for Exam Mode

| Principle | Implementation |
|-----------|----------------|
| **No timer visible** | Mimics real exam conditions - examiner controls timing, not candidate |
| **No notifications** | Auto-enable Focus/DND mode when exam starts |
| **Minimal UI** | Only essential elements on screen |
| **Full-screen** | Hide status bar, navigation - complete immersion |
| **No distractions** | No progress indicators, no scores until end |

### Visual Design by Part Type

**Parts WITHOUT images (Parts 1, 3, 4 - Conversational):**

Floating circle with alternating blue shades - calming, non-distracting breathing animation:

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                                                     │
│                                                     │
│                                                     │
│                     ╭──────╮                        │
│                   ╱          ╲                      │
│                  │    ◉◉◉    │    ← Breathing      │
│                  │   ◉◉◉◉◉   │      animation      │
│                  │    ◉◉◉    │      (blue shades)  │
│                   ╲          ╱                      │
│                     ╰──────╯                        │
│                                                     │
│                                                     │
│        "Tell me about your hometown..."             │
│                                                     │
│                                                     │
│                                                     │
└─────────────────────────────────────────────────────┘

Animation: Circle gently pulses between:
- #3B82F6 (Blue 500)
- #60A5FA (Blue 400)
- #93C5FD (Blue 300)
- #60A5FA (Blue 400)
...repeating, ~4 second cycle
```

**Part 2 (Long Turn - WITH images):**

Just the photos, nothing else. Clean, distraction-free:

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ┌─────────────────┐   ┌─────────────────┐         │
│  │                 │   │                 │         │
│  │                 │   │                 │         │
│  │    Photo 1      │   │    Photo 2      │         │
│  │                 │   │                 │         │
│  │                 │   │                 │         │
│  └─────────────────┘   └─────────────────┘         │
│                                                     │
│                                                     │
│    "Compare these photos and say which person      │
│     you think is enjoying their activity more."    │
│                                                     │
│                                                     │
└─────────────────────────────────────────────────────┘

No timer. No progress bar. No additional UI elements.
Photos take up most of the screen.
```

### Focus Mode Implementation

```typescript
// src/features/exam/services/focusMode.ts

import * as Notifications from 'expo-notifications';

interface FocusModeState {
  isActive: boolean;
  previousNotificationSettings: any;
  startedAt: Date;
}

async function enterFocusMode(): Promise<void> {
  // 1. Request DND permission (if needed)
  // 2. Store current notification settings
  // 3. Disable all notifications
  await Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: false,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  // 4. Hide status bar
  // 5. Lock orientation to portrait
  // 6. Prevent screen timeout
}

async function exitFocusMode(): Promise<void> {
  // Restore previous notification settings
  // Show status bar
  // Allow screen timeout
}
```

### Exam Flow (No Timer Visible)

```typescript
// Timing is managed internally, never shown to user
interface ExamPartTiming {
  part: ExamPart;
  targetDuration: number;    // Seconds
  actualDuration: number;    // Tracked but not shown
  startedAt: Date;
}

// AI examiner manages transitions naturally:
// - For Part 1: AI says "Thank you. Now let's move on to Part 2..."
// - For Part 2: AI gives time warning verbally ("You have about 20 seconds...")
// - For Part 3: AI guides discussion timing through conversation
// - For Part 4: AI concludes naturally

// User only sees: floating circle (or photos) + spoken prompts
// No visual timer, no progress bar, no "2:30 remaining" text
```

---

## 19. Revised Implementation Phases (with Testing)

### Phase 1: Foundation + Testing Setup
- [ ] Initialize Expo project with TypeScript
- [ ] **Set up Jest + React Testing Library**
- [ ] **Configure ESLint + Prettier**
- [ ] **Set up GitHub Actions CI**
- [ ] Configure Supabase (auth, database, storage)
- [ ] Implement dual onboarding flows
- [ ] Basic navigation structure
- [ ] UI component library (NativeWind)
- [ ] **Write tests for auth flows**
- [ ] 

### Phase 2: Core Exam Experience + Integration Tests
- [ ] ElevenLabs Conversational AI integration
- [ ] **Mock ElevenLabs for testing**
- [ ] Part 1-4 implementation
- [ ] Basic scoring with GPT-4o-mini
- [ ] **Unit tests for scoring logic (95% coverage)**
- [ ] Results screen with feedback
- [ ] **Integration tests for exam flow**

### Phase 3: Gamification + Unit Tests
- [ ] Contributions graph component
- [ ] Streak system with daily tracking
- [ ] XP and levels system
- [ ] Achievements system
- [ ] **Unit tests for gamification (90% coverage)**
- [ ] Progress statistics screens

### Phase 4: Practice Plan + Error Handling
- [ ] Exam countdown component
- [ ] Daily plan generation algorithm
- [ ] 45-minute cap enforcement
- [ ] **Comprehensive error handling**
- [ ] **Offline mode for cached content**
- [ ] Progress tracking visualization

### Phase 5: Monetization + E2E Tests
- [ ] RevenueCat integration
- [ ] Paywall UI
- [ ] Free trial flow
- [ ] Feature gating implementation
- [ ] **Set up Maestro for E2E tests**
- [ ] **E2E tests for critical flows**
- [ ] Recording playback feature
- [ ] Notification system

### Phase 6: Polish, Analytics + Launch
- [ ] **Add crash reporting (Sentry)**
- [ ] **Add analytics (Mixpanel/Amplitude)**
- [ ] Populate exam content database
- [ ] Part 2 photo assets
- [ ] **Cross-device testing**
- [ ] Performance optimization
- [ ] **Accessibility audit**
- [ ] App store assets
- [ ] Beta testing (TestFlight/Play Store)

---

## 20. Cost Estimation (Hybrid Architecture)

### 20.1 Per-Session API Costs

**Full Exam (~14 min for B2):**

| Part | Duration | Approach | Cost |
|------|----------|----------|------|
| **Part 1** (Interview) | ~2 min | TTS + STT | ~$0.03 |
| **Part 2** (Long Turn) | ~4 min | TTS + Recording + STT | ~$0.05 |
| **Part 3** (Collaborative) | ~3 min | **Conversational AI** | ~$0.30 |
| **Part 4** (Discussion) | ~4 min | TTS + STT | ~$0.05 |
| **Grading** (4 calls) | - | GPT-4o-mini | ~$0.02 |
| **Storage** | - | Supabase | ~$0.01 |
| **Total** | ~14 min | **Hybrid** | **~$0.46** |

**vs. All Conversational AI approach:**

| Approach | Cost per Session | Savings |
|----------|------------------|---------|
| All Conversational AI | ~$1.40 | - |
| **Hybrid (recommended)** | ~$0.46 | **67% cheaper** |

### 20.2 Cost Breakdown by Service

**ElevenLabs Pricing (as of Jan 2026):**

| Service | Pricing | Notes |
|---------|---------|-------|
| **Conversational AI** | ~$0.088-0.12/min | Part 3 only |
| **TTS API** | ~$0.30/1K chars | ~$0.02/min of speech |
| **STT API** | ~$0.05/min | Transcription |

**OpenAI GPT-4o-mini:**
- ~$0.15/1M input tokens, $0.60/1M output tokens
- Per grading call: ~$0.005

### 20.3 Monthly Cost Projections

| Active Users | Sessions/User/Mo | Monthly Cost | Cost/User |
|--------------|------------------|--------------|-----------|
| 100 | 20 | ~$920 | $9.20 |
| 1,000 | 20 | ~$9,200 | $9.20 |
| 10,000 | 20 | ~$92,000 | $9.20 |

### 20.4 Break-Even Analysis

**Subscription pricing:** $9.99/month

| Metric | Value |
|--------|-------|
| Revenue per user | $9.99 |
| API cost per user (20 sessions) | ~$9.20 |
| **Gross margin** | **$0.79 (8%)** |

⚠️ **Thin margins alert!** Consider:
1. **Annual plans** ($79.99/year = $6.67/mo) → negative margin on heavy users
2. **Usage caps** beyond 20 sessions/month
3. **TTS caching** for repeated phrases (saves ~20%)
4. **Volume discounts** from ElevenLabs at scale

### 20.5 Cost Optimization Strategies

| Strategy | Savings | Effort |
|----------|---------|--------|
| **Hybrid architecture** | ~67% | ✅ Done |
| **Lazy TTS caching** | ~50-90% on scripted TTS after cache builds (questions recycled) | Low-Medium (DB column + Edge Function + hook conditional) |
| Cache common TTS phrases | ~10-20% | Low |
| Batch STT requests | ~5% | Low |
| Negotiate ElevenLabs enterprise | ~20-30% | Medium |
| Use Whisper for STT fallback | ~40% on STT | Medium |
| Limit Part 3 to 1x/day | Variable | Low |

Lazy caching leverages question recycling: First play generates/pays TTS; subsequent plays use cached MP3 (zero TTS cost). Builds automatically—no batch script required. Egress negligible (<$0.01 per 1,000 downloads at scale).

### 20.6 Recommended ElevenLabs Tier

| User Scale | Recommended Tier | Monthly Cost | Why |
|------------|------------------|--------------|-----|
| 0-500 | Creator ($11/mo) | $11 + usage | 10 concurrent, 250 min included |
| 500-2,000 | Pro ($99/mo) | $99 + usage | 20 concurrent, 1100 min included |
| 2,000-5,000 | Scale ($330/mo) | $330 + usage | 30 concurrent, 3600 min included |
| 5,000+ | Business/Enterprise | Custom | Negotiated rates |

---
