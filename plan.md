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

### 4.2 Speech Architecture

| Exam Part | Type | Implementation |
|-----------|------|----------------|
| **Part 1** (Interview) | Conversational | ElevenLabs Conversational AI |
| **Part 2** (Long Turn) | Monologue | Record → STT → LLM Grade |
| **Part 3** (Collaborative) | Conversational | ElevenLabs Conversational AI |
| **Part 4** (Discussion) | Conversational | ElevenLabs Conversational AI |

**Part 2 Flow (Monologue - Different from others):**
```
Display photos to user
    ↓
AI examiner speaks prompt (ElevenLabs TTS)
    ↓
User speaks for ~1 minute (recorded)
    ↓
Recording → ElevenLabs STT → Transcript
    ↓
GPT-4o-mini grades transcript against Cambridge criteria
    ↓
Brief follow-up question (TTS)
    ↓
User responds → STT → Grade
    ↓
Results
```

**Parts 1, 3, 4 Flow (Conversational):**
```
Initialize ElevenLabs Conversation Agent
    - System prompt: Cambridge examiner persona
    - Part-specific instructions + content
    ↓
Real-time voice conversation
    - Natural turn-taking
    - Agent manages timing
    - Full transcript tracked
    ↓
Session ends
    ↓
LLM grades full transcript
    ↓
Results + Feedback
```

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
│   │   │   │   ├── useConversationalAI.ts
│   │   │   │   └── useMonologueRecording.ts
│   │   │   └── services/
│   │   │       ├── elevenlabsAgent.ts
│   │   │       └── transcription.ts
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
└── tailwind.config.js
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

    created_at TIMESTAMPTZ DEFAULT NOW()
);

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
- [ ] Initialize Expo project with TypeScript
- [ ] Set up folder structure
- [ ] Configure Supabase (auth, database, storage)
- [ ] Implement dual onboarding flows (self-signup + academy invite)
- [ ] Basic navigation structure
- [ ] UI component library (NativeWind)
- [ ] Authentication flows

### Phase 2: Core Exam Experience
- [ ] ElevenLabs Conversational AI integration
- [ ] Part 1 (Interview) - conversational flow
- [ ] Part 2 (Long Turn) - recording + STT + grading
- [ ] Parts 3 & 4 - conversational flows
- [ ] Basic scoring with GPT-4o-mini
- [ ] Results screen with feedback
- [ ] Photo display for Part 2

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

1. **`/src/services/elevenlabs/conversationalAgent.ts`**
   - Core voice interaction for Parts 1, 3, 4
   - Most complex integration

2. **`/app/(onboarding)/`**
   - User acquisition funnel
   - Critical for conversion

3. **`/src/components/gamification/ContributionsGraph.tsx`**
   - Key differentiator UI
   - High engagement feature

4. **`/src/features/scoring/services/gradingEngine.ts`**
   - Cambridge criteria implementation
   - LLM prompt engineering

5. **`/app/exam/session/[id].tsx`**
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

## 16. Plan Analysis: Identified Flaws & Gaps

### 16.1 Critical Missing Elements

| Gap | Severity | Impact |
|-----|----------|--------|
| **No Testing Strategy** | 🔴 Critical | No unit tests, integration tests, or E2E tests defined. Will lead to regressions and bugs. |
| **No Error Handling Strategy** | 🔴 Critical | No plan for network failures, API errors, audio permission denials, or edge cases. |
| **No Offline Mode** | 🟡 Medium | Users with poor connectivity can't practice. Exam content could be cached. |
| **No Analytics/Monitoring** | 🟡 Medium | No crash reporting, usage analytics, or funnel tracking defined. |
| **No Accessibility (a11y)** | 🟡 Medium | No VoiceOver/TalkBack considerations. Required for app store compliance. |
| **No Localization (i18n)** | 🟡 Medium | Only English UI assumed. Spanish speakers (your market?) excluded. |
| **No CI/CD Pipeline** | 🟡 Medium | No automated builds, linting, or deployment strategy. |
| **No Content Moderation** | 🟡 Medium | If users can record/upload, need to consider inappropriate content. |
| **No Rate Limiting** | 🟡 Medium | API abuse protection not considered for LLM/ElevenLabs calls. |
| **No Data Privacy/GDPR** | 🟡 Medium | Audio recordings are PII. Need consent flows and deletion capabilities. |

### 16.2 Technical Risks Not Addressed

| Risk | Description | Mitigation Needed |
|------|-------------|-------------------|
| **ElevenLabs Latency** | Real-time conversation requires <300ms round-trip. Not tested. | Prototype early, have fallback TTS |
| **LLM Scoring Consistency** | GPT-4o-mini may score inconsistently across sessions | Add calibration prompts, score normalization |
| **Audio Quality Variance** | Different devices = different mic quality = different STT accuracy | Normalize audio, test on low-end devices |
| **Cost Explosion** | ElevenLabs + OpenAI per session could be expensive at scale | Calculate unit economics, set usage caps |
| **Cold Start Times** | Expo + Supabase + ElevenLabs init could be slow | Lazy loading, skeleton screens |

### 16.3 Product/UX Gaps

| Gap | Issue |
|-----|-------|
| **No onboarding validation** | What if user selects wrong exam level? No way to change easily. |
| **No skip/pause mid-exam** | What if user gets interrupted? Exam state persistence unclear. |
| **No practice history search** | As sessions accumulate, finding past sessions becomes hard. |
| **No sharing/social proof** | No way to share achievements or scores (viral loop missing). |
| **No referral system** | B2B academies could refer other academies. |
| **Weak Part 2 simulation** | Photo comparison requires showing 2+ images well on mobile. Layout challenges. |

### 16.4 Architectural Concerns

| Concern | Issue |
|---------|-------|
| **Supabase Edge Functions limits** | Complex LLM grading may timeout (10s limit). May need separate backend. |
| **Audio storage costs** | 45 min/day × many users × cloud storage = significant costs |
| **No caching strategy** | Exam content, TTS audio could be cached to reduce API calls |
| **Database indexing** | Schema defined but no query optimization for leaderboards, history |

---

## 17. Testing Strategy

### 17.1 Testing Pyramid

```
                    ┌─────────────┐
                    │   E2E (5%)  │  ← Maestro/Detox
                    ├─────────────┤
                   /│Integration  │\  ← API mocks, component integration
                  / │   (15%)    │ \
                 /  ├─────────────┤  \
                /   │             │   \
               /    │ Unit Tests  │    \  ← Jest, React Testing Library
              /     │   (80%)     │     \
             /      └─────────────┘      \
```

### 17.2 Unit Testing (Jest + React Testing Library)

**What to test:**
- Scoring calculation functions
- Cambridge Scale conversion
- Streak/XP calculations
- Date/time helpers
- Audio duration parsing
- Form validation

**Example test structure:**
```
__tests__/
├── unit/
│   ├── scoring/
│   │   ├── calculatePronunciationScore.test.ts
│   │   ├── mapToCambridgeScale.test.ts
│   │   └── weightedAverage.test.ts
│   ├── gamification/
│   │   ├── calculateXP.test.ts
│   │   ├── streakLogic.test.ts
│   │   └── levelThresholds.test.ts
│   └── utils/
│       ├── formatters.test.ts
│       └── validators.test.ts
```

### 17.3 Integration Testing

**What to test:**
- Supabase auth flow (mocked)
- API response handling
- State management (Zustand stores)
- Navigation flows
- Audio recording → transcription pipeline (mocked APIs)

**Key integration tests:**
```
__tests__/
├── integration/
│   ├── auth/
│   │   ├── loginFlow.test.tsx
│   │   └── academyInvite.test.tsx
│   ├── exam/
│   │   ├── startExamSession.test.tsx
│   │   ├── submitPartResults.test.tsx
│   │   └── examStateRecovery.test.tsx
│   └── subscription/
│       ├── paywallDisplay.test.tsx
│       └── entitlementGating.test.tsx
```

### 17.4 E2E Testing (Maestro)

**Critical user flows to test:**
1. **Onboarding → Free Trial → Paywall**
   - New user downloads app
   - Completes onboarding
   - Takes free exam
   - Sees paywall

2. **Full Exam Session**
   - Start exam
   - Complete all 4 parts
   - View results
   - See XP awarded

3. **Streak Maintenance**
   - Practice today
   - Verify streak updates
   - Check contributions graph

**Maestro flow example:**
```yaml
# .maestro/flows/onboarding.yaml
appId: com.mintzo.app
---
- launchApp
- tapOn: "Get Started"
- tapOn: "B2 First"
- tapOn: "Continue"
- inputText:
    id: "exam-date-picker"
    text: "2026-03-15"
- tapOn: "Start Free Trial"
- assertVisible: "Part 1: Interview"
```

### 17.5 Testing in CI/CD

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test:unit
      - run: npm run lint
      - run: npm run typecheck

  integration-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test:integration

  e2e-tests:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: mobile-dev-inc/action-maestro-cloud@v1
        with:
          api-key: ${{ secrets.MAESTRO_CLOUD_API_KEY }}
          app-file: app-release.apk
```

### 17.6 Test Coverage Targets

| Area | Target | Rationale |
|------|--------|-----------|
| Scoring logic | 95% | Critical for user trust |
| Gamification | 90% | Affects engagement |
| Auth flows | 85% | Security critical |
| UI components | 70% | Basic rendering checks |
| API services | 80% | Mock external calls |

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
| **Duolingo** | Gamification, streaks, XP animations, character mascot |
| **Headspace** | Calm exam environment, breathing exercises before exam |
| **Strava** | Activity feed, contributions graph, social sharing |
| **Forest** | Focus mode, visual progress (trees = completed parts) |
| **Notion** | Clean typography, content organization |

### 18.3 Mintzo Design System (Proposed)

**Color Palette:**
```
Primary:      #6366F1 (Indigo) - CTAs, active states
Secondary:    #10B981 (Emerald) - Success, XP, streaks
Background:   #0F172A (Slate 900) - Dark mode base
Surface:      #1E293B (Slate 800) - Cards, modals
Text Primary: #F8FAFC (Slate 50)
Text Muted:   #94A3B8 (Slate 400)
Error:        #EF4444 (Red 500)
Warning:      #F59E0B (Amber 500)

Exam Levels:
B2:           #3B82F6 (Blue 500)
C1:           #8B5CF6 (Violet 500)
C2:           #EC4899 (Pink 500)
```

**Typography:**
```
Font Family:  SF Pro (iOS) / Roboto (Android)
Headings:     SF Pro Display (Bold)
Body:         SF Pro Text (Regular)

Sizes:
H1:           32px / 40px line-height
H2:           24px / 32px
H3:           20px / 28px
Body:         16px / 24px
Caption:      14px / 20px
Small:        12px / 16px
```

**Spacing (8pt grid):**
```
xs:   4px
sm:   8px
md:   16px
lg:   24px
xl:   32px
2xl:  48px
```

**Border Radius:**
```
sm:   8px   (buttons, inputs)
md:   12px  (cards)
lg:   16px  (modals)
full: 9999px (avatars, badges)
```

### 18.4 Key Screen Concepts

**Home Screen (Practice Plan):**
```
┌─────────────────────────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  Status Bar      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  👋 Good morning, Jon                              │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ 🔥 12 day streak          47 days to exam  │   │
│  │    ████████████░░░░░░░░░░░░░  68% ready    │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Today's Practice                    32/45 min     │
│  ┌─────────────────────────────────────────────┐   │
│  │ ✅ Part 1 Interview                  10 min │   │
│  │ ✅ Part 2 Long Turn                  12 min │   │
│  │ ○  Part 3 Collaborative              10 min │   │
│  │ ○  Part 4 Discussion                 13 min │   │
│  │                                             │   │
│  │        [ Continue Practice ]                │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Your Activity                                      │
│  ┌─────────────────────────────────────────────┐   │
│  │ ░░░░░░█░░░░███░░█████░░░████░░░███████████ │   │
│  │ Jan            Feb            Mar          │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
├─────────────────────────────────────────────────────┤
│  🏠 Home    📚 Practice    📊 Progress    👤 Me   │
└─────────────────────────────────────────────────────┘
```

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

## 20. Cost Estimation (Missing from Original)

### Per-Session API Costs (Estimated)

| Service | Usage per Session | Cost |
|---------|------------------|------|
| **ElevenLabs Conversational AI** | ~10 min audio | ~$0.30 |
| **ElevenLabs STT** | ~5 min transcription | ~$0.05 |
| **OpenAI GPT-4o-mini** | ~4 grading calls | ~$0.02 |
| **Supabase** | Storage + DB | ~$0.01 |
| **Total per session** | | **~$0.38** |

### Monthly Cost Projection

| Users | Sessions/User/Month | Total Cost |
|-------|---------------------|------------|
| 100 | 20 | $760 |
| 1,000 | 20 | $7,600 |
| 10,000 | 20 | $76,000 |

**Break-even analysis:**
- At $9.99/month subscription
- Need ~4% of API cost covered per user
- 20 sessions × $0.38 = $7.60 cost per active user
- Margin: $9.99 - $7.60 = **$2.39 per user** ✅

⚠️ **Risk:** Heavy users (45 min/day × 30 days) could cost $17+/month → **negative margin**

**Mitigation:**
- Cache common TTS responses
- Batch grading calls
- Implement usage-based throttling for abuse
