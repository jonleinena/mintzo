# Mintzo - App Store Publication Roadmap

This document covers everything needed to go from the current state to a published App Store listing. Written for a first-time publisher.

---

## Table of Contents

1. [Apple Developer Program](#1-apple-developer-program)
2. [Critical blockers (Apple will reject without these)](#2-critical-blockers)
3. [Production build setup](#3-production-build-setup)
4. [Code signing and provisioning](#4-code-signing-and-provisioning)
5. [Environment variables and secrets](#5-environment-variables-and-secrets)
6. [App Store Connect setup](#6-app-store-connect-setup)
7. [Subscription configuration](#7-subscription-configuration)
8. [Privacy and legal compliance](#8-privacy-and-legal-compliance)
9. [Pre-submission checklist](#9-pre-submission-checklist)
10. [Metro server, builds, and deployment](#10-metro-server-builds-and-deployment)

---

## 1. Apple Developer Program

You need a **paid Apple Developer Program membership** ($99/year). Without it you cannot:

- Submit apps to the App Store
- Use production push notifications
- Create App Store provisioning profiles
- Test real in-app purchases (RevenueCat sandbox works with free accounts, but production does not)

Enroll at https://developer.apple.com/programs/enroll/

Once enrolled you get:
- A **Team ID** (10-character string like `A1B2C3D4E5`)
- Access to App Store Connect (where you manage listings, TestFlight, etc.)
- Access to Certificates, Identifiers & Profiles

---

## 2. Critical blockers

These are hard requirements. Apple reviewers will reject the app if any are missing.

### 2.1 Account deletion

Apple guideline 5.1.1(v): any app that supports account creation must let users delete their account from within the app.

**What's missing**: No delete account function exists anywhere in the codebase.

**What to build**:
- A "Delete Account" button in the profile/settings screen
- A confirmation dialog explaining what will be deleted
- A Supabase edge function or RPC that:
  - Deletes the user's data from `profiles`, `exam_sessions`, `exam_part_results`, `user_progress`, `daily_activity`, `user_achievements`, `conversation_sessions`, `subscriptions`
  - Calls `supabase.auth.admin.deleteUser(userId)` using the service role key
  - Cancels any active RevenueCat subscription (or at minimum informs the user they must cancel separately via Apple settings)
- The client calls this function, then signs out and navigates to the welcome screen

### 2.2 Privacy Policy

Required for all apps. Doubly required because the app uses subscriptions, collects audio data, and sends data to third parties (ElevenLabs, OpenAI, Supabase).

**What to do**:
- Write a privacy policy (or use a generator - search "app privacy policy generator")
- Host it at a public URL (a simple GitHub Pages site or Notion page works)
- It must cover: what data you collect, how you use it, third-party services, data retention, user rights, contact info
- Add the URL to `app.json` under `expo.ios.privacyManifests` or as a config field
- Link it in the paywall screen, profile/settings screen, and App Store Connect listing

### 2.3 Terms of Service

Required for apps with subscriptions (Apple guideline 3.1.2).

**What to do**:
- Write terms of service covering: subscription terms, auto-renewal disclosure, cancellation policy, refund policy (Apple handles refunds), acceptable use
- Host at a public URL
- Link it alongside the privacy policy in the paywall and settings

### 2.4 Subscription disclosures in the paywall

Apple guideline 3.1.2(a) requires the paywall to clearly state:
- The price and duration of each subscription option
- That payment is charged to the iTunes account at confirmation
- That subscriptions auto-renew unless cancelled at least 24 hours before the end of the current period
- That the account will be charged for renewal within 24 hours prior to the end of the current period
- That subscriptions can be managed and auto-renewal turned off in Account Settings
- Links to Privacy Policy and Terms of Service

The current paywall shows prices but is missing the auto-renewal disclosures and legal links.

### 2.5 Unused iOS permissions

The current Info.plist declares permissions for Camera (`NSCameraUsageDescription`) and Face ID (`NSFaceIDUsageDescription`) that are never used in code. Apple will ask you to justify these during review, and if you can't, they reject.

**Fix**: Remove these entries from `ios/Mintzo/Info.plist` and from `app.json` if present.

### 2.6 Privacy manifest completion

`ios/Mintzo/PrivacyInfo.xcprivacy` exists but `NSPrivacyCollectedDataTypes` is empty. Apple requires you to declare what data the app collects.

**Data types to declare** (based on what Mintzo actually collects):
- **Audio Data** - microphone recordings during exam practice
- **User ID** - Supabase auth user identifier
- **Email Address** - if user registers with email
- **Purchase History** - subscription status via RevenueCat
- **Usage Data** - exam sessions, scores, streaks
- **Performance Data** - exam scores and feedback

Each type needs: purpose (App Functionality), whether it's linked to the user's identity, and whether it's used for tracking (no, in this case).

---

## 3. Production build setup

### 3.1 EAS Build (recommended approach)

EAS (Expo Application Services) is the standard way to build Expo apps for the App Store. It handles code signing, builds in the cloud, and uploads directly to App Store Connect.

**Create `eas.json`** in the project root:

```json
{
  "cli": {
    "version": ">= 16.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "ios": {
        "autoIncrement": true,
        "buildConfiguration": "Release"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "YOUR_APPLE_ID_EMAIL",
        "ascAppId": "YOUR_APP_STORE_CONNECT_APP_ID",
        "appleTeamId": "YOUR_TEAM_ID"
      }
    }
  }
}
```

**Install EAS CLI**:

```sh
bun add -g eas-cli
eas login
```

**Build for App Store**:

```sh
eas build --platform ios --profile production
```

**Submit to App Store Connect**:

```sh
eas submit --platform ios --profile production
```

### 3.2 Alternative: local Xcode build

If you prefer not to use EAS cloud builds:

1. `npx expo prebuild --platform ios --clean`
2. Open `ios/Mintzo.xcworkspace` in Xcode
3. Select the "Mintzo" target, go to Signing & Capabilities
4. Set your Team (from your Apple Developer account)
5. Set the signing to "Automatically manage signing"
6. Product > Archive
7. Window > Organizer > Distribute App > App Store Connect

---

## 4. Code signing and provisioning

This is the part that confuses most first-time developers. Here's what you need:

### What Apple requires

- **Certificate**: proves you are who you say you are. Created in Keychain Access or through Xcode.
  - Development certificate: for testing on your device
  - Distribution certificate: for App Store submission
- **App ID**: registered identifier for your app (`com.mintzo.app`). Create at developer.apple.com > Certificates, Identifiers & Profiles > Identifiers.
- **Provisioning Profile**: ties together your certificate, App ID, and (for development) device UDIDs.

### Easiest path

Use **Xcode automatic signing** or **EAS Build** (which handles all of this for you). If you use `eas build`, it will prompt you to log in with your Apple ID and create/download certificates automatically.

### Entitlements

The file `ios/Mintzo/Mintzo.entitlements` is currently empty. You need to add:

- **In-App Purchase** entitlement (for RevenueCat subscriptions)
- **Associated Domains** (if you add universal links later)

In Xcode: Target > Signing & Capabilities > + Capability > In-App Purchase.

---

## 5. Environment variables and secrets

### 5.1 Client-side variables (baked into the app bundle)

These go in `.env` and are embedded at build time via the `EXPO_PUBLIC_` prefix. Anyone who decompiles the app can read these, so they must be safe to expose.

| Variable | Purpose | Production value needed? |
|----------|---------|------------------------|
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL | Already set |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase publishable key | Already set |
| `EXPO_PUBLIC_ELEVENLABS_API_KEY` | ElevenLabs API key | Already set |
| `EXPO_PUBLIC_ELEVENLABS_VOICE_ID` | Voice for TTS | Already set (optional) |
| `EXPO_PUBLIC_ELEVENLABS_AGENT_ID_B2_PART3` | B2 conversational agent | Already set |
| `EXPO_PUBLIC_ELEVENLABS_AGENT_ID_C1_PART3` | C1 conversational agent | Already set |
| `EXPO_PUBLIC_ELEVENLABS_AGENT_ID_C2_PART3` | C2 conversational agent | Already set |
| `EXPO_PUBLIC_REVENUECAT_IOS_KEY` | RevenueCat iOS API key | **Needs production key** |
| `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` | RevenueCat Android API key | Not needed for iOS launch |

**Important**: The current `EXPO_PUBLIC_REVENUECAT_IOS_KEY` is a test key (`test_JAQCcmaDk...`). For production, you need the production API key from your RevenueCat dashboard after connecting your App Store Connect account.

### 5.2 Server-side variables (Supabase edge functions)

These are set in the Supabase dashboard under Edge Functions > Secrets, not in `.env`. They never leave the server.

| Variable | Purpose | Status |
|----------|---------|--------|
| `OPENAI_API_KEY` | Grading via GPT-4o-mini | Must be set |
| `ELEVENLABS_API_KEY` | Voice agent sessions | Must be set |
| `ELEVENLABS_VOICE_ID` | Voice selection | Must be set |
| `ELEVENLABS_AGENT_ID_B2_PART3` | B2 agent | Must be set |
| `ELEVENLABS_AGENT_ID_C1_PART3` | C1 agent | Must be set |
| `ELEVENLABS_AGENT_ID_C2_PART3` | C2 agent | Must be set |
| `SUPABASE_URL` | Auto-provided by Supabase | Automatic |
| `SUPABASE_ANON_KEY` | Auto-provided by Supabase | Automatic |
| `SUPABASE_SERVICE_ROLE_KEY` | Auto-provided by Supabase | Automatic |
| `REVENUECAT_WEBHOOK_SECRET` | Webhook auth from RevenueCat | Must be set |

### 5.3 EAS Build secrets

When building with EAS, environment variables need to be set as EAS Secrets so they're available during cloud builds:

```sh
eas secret:create --name EXPO_PUBLIC_ELEVENLABS_API_KEY --value "your_key"
eas secret:create --name EXPO_PUBLIC_SUPABASE_URL --value "https://..."
# ... repeat for all EXPO_PUBLIC_* vars
```

### 5.4 Security note on EXPO_PUBLIC_ keys

The ElevenLabs API key is exposed client-side. This is a risk - a determined user could extract it and use your quota. Consider:

- Setting usage limits on your ElevenLabs account
- Moving TTS calls server-side (through edge functions) so the API key stays on the server
- Monitoring usage in your ElevenLabs dashboard

The Supabase anon key is designed to be public - RLS policies protect data. This is fine.

---

## 6. App Store Connect setup

After enrolling in the Apple Developer Program:

### 6.1 Create the app listing

1. Go to https://appstoreconnect.apple.com
2. My Apps > "+" > New App
3. Fill in:
   - **Platform**: iOS
   - **Name**: Mintzo (or whatever you want displayed)
   - **Primary Language**: English
   - **Bundle ID**: com.mintzo.app (register it first in Certificates, Identifiers & Profiles)
   - **SKU**: any unique string (e.g., `mintzo-ios-001`)

### 6.2 App Store listing content you need to prepare

| Field | What it is | Notes |
|-------|-----------|-------|
| **App Name** | Display name on the App Store | Max 30 characters |
| **Subtitle** | Short tagline | Max 30 characters, e.g., "Cambridge Speaking Practice" |
| **Description** | Full description | Max 4000 characters. Explain what the app does, who it's for |
| **Keywords** | Search keywords | Max 100 characters, comma-separated |
| **Category** | Primary and secondary | Primary: Education. Secondary: Productivity or Reference |
| **Screenshots** | Required per device size | At least iPhone 6.7" and 6.5" (or 6.9"). 3-10 screenshots each |
| **App Icon** | 1024x1024 PNG | No transparency, no rounded corners (Apple adds them) |
| **Privacy Policy URL** | Public URL | Required |
| **Support URL** | Public URL | Required - where users get help |
| **Marketing URL** | Public URL | Optional - your website |
| **Age Rating** | Content questionnaire | Fill out the questionnaire in App Store Connect |
| **App Review Information** | Login credentials for reviewers | Provide a test account (email/password) so the reviewer can test |

### 6.3 Screenshots

You need screenshots for at least these device sizes:
- **6.7" display** (iPhone 15 Pro Max / 16 Pro Max): 1290 x 2796 px
- **6.5" display** (iPhone 11 Pro Max): 1284 x 2778 px (or use 6.7" for both)

Optional but recommended:
- **6.9" display** (iPhone 16 Pro Max): 1320 x 2868 px
- **iPad Pro 12.9"**: if you support iPad

You can take screenshots on the simulator and add marketing text overlays using tools like Figma, Canva, or dedicated tools like Screenshots.pro.

### 6.4 Review information

Apple reviewers will test your app. They need:
- A working test account (create a test user in Supabase)
- Notes explaining how to use the app (what to tap, what to expect)
- If the app requires a subscription for core features, provide a promo code or explain how to access premium features for testing

---

## 7. Subscription configuration

### 7.1 App Store Connect subscriptions

Before RevenueCat can sell subscriptions, you must create them in App Store Connect:

1. App Store Connect > Your App > Subscriptions
2. Create a **Subscription Group** (e.g., "Mintzo Premium")
3. Create individual subscriptions:
   - Monthly (matches your paywall)
   - 3-month
   - 6-month
   - Annual
4. For each subscription, set:
   - Reference name (internal)
   - Product ID (e.g., `com.mintzo.app.monthly`)
   - Price (set in each territory)
   - Duration
   - Free trial period (if you want Apple-managed free trials)

### 7.2 RevenueCat configuration

1. In RevenueCat dashboard, connect your App Store Connect account
2. Create products matching the App Store Connect product IDs
3. Create offerings and packages
4. Get the **production** API key (not the test key currently in `.env`)
5. Set up the webhook:
   - In RevenueCat > Your App > Integrations > Webhooks
   - URL: `https://jngxzbwwhowgwvcxytzn.supabase.co/functions/v1/revenuecat-webhook`
   - Set the webhook secret and add it as `REVENUECAT_WEBHOOK_SECRET` in Supabase edge function secrets

### 7.3 Paid Applications Agreement

In App Store Connect > Agreements, Tax, and Banking, you must complete the **Paid Applications** agreement before you can sell subscriptions. This requires:
- Bank account information
- Tax forms (W-8BEN or W-9 depending on your country)
- Contact information

Without this, your subscription products won't be available for sale even after approval.

---

## 8. Privacy and legal compliance

### 8.1 App Privacy section in App Store Connect

When submitting, App Store Connect asks you to fill out a privacy questionnaire about what data types your app collects. Based on the codebase:

**Data types to declare:**

| Data Type | Collected | Linked to Identity | Used for Tracking |
|-----------|-----------|-------------------|-------------------|
| Email Address | Yes (registration) | Yes | No |
| User ID | Yes (Supabase auth) | Yes | No |
| Audio Data | Yes (microphone for exam) | Yes | No |
| Purchase History | Yes (RevenueCat) | Yes | No |
| Usage Data | Yes (exam sessions, scores) | Yes | No |
| Performance Data | Yes (exam scores) | Yes | No |

**Purpose for all**: App Functionality

### 8.2 GDPR (if you have EU users)

If you plan to serve users in the EU:
- Your privacy policy must mention GDPR rights (access, deletion, portability)
- Account deletion (section 2.1) covers the "right to erasure"
- Consider adding a data export feature (nice to have, not blocking)

### 8.3 Children's privacy (COPPA)

If your app targets users under 13, additional rules apply. Cambridge exams are typically taken by adults and older teens, so this likely doesn't apply. Set the age rating questionnaire accordingly - selecting "17+" for no restricted content, or the appropriate bracket.

---

## 9. Pre-submission checklist

Run through this before submitting:

### Code

- [ ] Account deletion implemented and tested
- [ ] Privacy Policy and Terms of Service URLs added to paywall and settings
- [ ] Subscription auto-renewal disclosures added to paywall
- [ ] Unused permissions (Camera, Face ID) removed from Info.plist
- [ ] PrivacyInfo.xcprivacy `NSPrivacyCollectedDataTypes` populated
- [ ] `EXPO_PUBLIC_REVENUECAT_IOS_KEY` set to production key
- [ ] All edge functions deployed and working with `verify_jwt: false`
- [ ] No console.log statements leaking sensitive data in production
- [ ] No hardcoded test credentials in committed code

### App Store Connect

- [ ] App listing created with name, description, keywords
- [ ] Screenshots uploaded for required device sizes
- [ ] 1024x1024 app icon uploaded
- [ ] Privacy Policy URL set
- [ ] Support URL set
- [ ] Age rating questionnaire completed
- [ ] App Privacy section filled out
- [ ] Subscription products created and approved
- [ ] Paid Applications agreement completed (banking, tax)
- [ ] Review notes written with test account credentials

### Build

- [ ] `eas.json` created with production profile
- [ ] EAS secrets configured for all `EXPO_PUBLIC_*` variables
- [ ] Production build created with `eas build --platform ios --profile production`
- [ ] Build tested via TestFlight before submission
- [ ] Version and build number are correct

### Testing

- [ ] Full exam flow works (Part 1 through grading)
- [ ] Subscription purchase works in sandbox
- [ ] Restore purchases works
- [ ] Account creation and login work
- [ ] Account deletion works
- [ ] App handles no internet connection gracefully
- [ ] App handles microphone permission denial gracefully
- [ ] No crashes during normal use

---

## 10. Metro server, builds, and deployment

This section explains how Metro, builds, and deployment work - since this is likely unfamiliar territory.

### 10.1 What Metro is (and isn't)

Metro is the JavaScript bundler for React Native. It bundles your TypeScript/JavaScript source code into a single file that the native app loads.

**During development**: Metro runs as a local server (`bun start`). The app on your simulator or device connects to this server over the network and loads the JS bundle. When you save a file, Metro sends the update to the app (hot reload).

**In production**: Metro is NOT running. There is no server. The JS bundle is compiled ahead of time and embedded directly into the `.ipa` file that users download from the App Store. The app is fully self-contained.

This means:
- You do NOT need to host a Metro server anywhere
- You do NOT need a backend server for the app to run (Supabase edge functions are your backend)
- The only "servers" involved are Supabase (managed for you) and the third-party APIs (ElevenLabs, OpenAI)

### 10.2 Development workflow

```sh
# Install dependencies
bun install

# Start Metro dev server (for local development)
bun start

# Build and run on iOS simulator (in another terminal or via Xcode)
bun run ios

# Or use XcodeBuildMCP from Claude Code
```

Metro dev server flags:
- `bun start --clear` - clear Metro cache (use when things behave strangely)
- `bun start --port 8082` - use a different port if 8081 is taken

### 10.3 Build types

| Build type | What it produces | When to use |
|------------|-----------------|-------------|
| **Debug** (Metro dev server) | App that loads JS from your Mac | Daily development |
| **Release** (local Xcode archive) | Standalone `.ipa` with bundled JS | Testing production behavior locally |
| **EAS Development** | Debug build with dev client | Testing on physical devices without Xcode |
| **EAS Preview** | Internal distribution build | Sharing with testers via QR code |
| **EAS Production** | App Store-ready `.ipa` | Submitting to App Store / TestFlight |

### 10.4 The build-to-store pipeline

```
1. Code changes
   |
2. bun run typecheck && bun run lint && bun run test
   |
3. eas build --platform ios --profile production
   |  (builds in EAS cloud, handles code signing)
   |
4. eas submit --platform ios
   |  (uploads to App Store Connect)
   |
5. TestFlight (automatic after upload)
   |  (test on real devices, share with beta testers)
   |
6. Submit for Review (in App Store Connect)
   |  (Apple reviews, typically 24-48 hours)
   |
7. Release (manual or automatic after approval)
```

### 10.5 Updates after launch

Once the app is live, updates follow the same pipeline: code change > build > submit > review > release.

**OTA (Over-the-Air) updates** via `expo-updates` are possible for JS-only changes (no native code changes). This lets you push bug fixes without going through App Store review. This is not currently configured but can be added later.

### 10.6 Environment variable flow

```
.env file (local)
   |
   +--> EXPO_PUBLIC_* vars are embedded into the JS bundle at build time
   |    (visible to anyone who decompiles the app)
   |
   +--> Non-EXPO_PUBLIC vars are NOT included in the bundle
        (only available during the build process itself)

Supabase Dashboard > Edge Functions > Secrets
   |
   +--> Server-side vars (OPENAI_API_KEY, SERVICE_ROLE_KEY, etc.)
        (never leave the server)
```

For EAS cloud builds, set secrets with `eas secret:create` so the build server has access to your `.env` values.

### 10.7 Crash reporting (recommended addition)

Add Sentry before going to production. It catches crashes and errors from real users.

```sh
bunx expo install @sentry/react-native
```

Then wrap the app root and configure with a Sentry DSN. This gives you:
- Crash reports with stack traces
- Performance monitoring
- Release tracking (which version has which bugs)

This is not strictly required for App Store approval, but going live without crash reporting means you won't know when users hit problems.

### 10.8 Additional env vars needed for production

Beyond what's already configured, you'll need:

| Variable | Where | Purpose |
|----------|-------|---------|
| `SENTRY_DSN` | `.env` as `EXPO_PUBLIC_SENTRY_DSN` | Crash reporting |
| `EXPO_PUBLIC_REVENUECAT_IOS_KEY` | `.env` (replace test key) | Production subscriptions |
| `REVENUECAT_WEBHOOK_SECRET` | Supabase secrets | Webhook authentication |

And these Apple-side credentials (managed by EAS or Xcode, not in `.env`):
- Apple Developer Team ID
- App Store Connect API Key (for automated submissions)
- Distribution certificate + provisioning profile (EAS handles this automatically)
