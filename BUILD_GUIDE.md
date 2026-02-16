# Mintzo - iOS Build Guide

How to build and run Mintzo on a physical iPhone for development.

This app uses Expo with a custom dev client (not Expo Go). Native modules like LiveKit WebRTC, RevenueCat, and ElevenLabs require a full native build. Audio features (the core of the app) only work on a physical device, not the simulator.

---

## Prerequisites

| Tool | Minimum version | Check with |
|------|----------------|------------|
| macOS | 15+ (Sequoia) | `sw_vers -productVersion` |
| Xcode | 16+ | `xcodebuild -version` |
| Node.js | 18+ (20 LTS recommended) | `node --version` |
| Bun | 1.x | `bun --version` |
| CocoaPods | Comes with Xcode | `pod --version` |
| Physical iPhone | iOS 15.1+ | Settings > General > About |
| Apple Developer account | Free or paid (see notes below) | - |

**Free vs paid Apple Developer account:**
- A free account (Personal Team) works for building and running on your own device.
- A free account does NOT support push notifications. The `expo-notifications` package has been intentionally removed from this project to avoid build failures on free accounts. Re-add it when you have a paid account.
- RevenueCat in-app purchases require a paid account and App Store Connect configuration to test real transactions. The app handles a missing/empty RevenueCat key gracefully - subscription features just won't work.

---

## Step 1: Clone and install dependencies

```sh
git clone <repo-url> mintzo
cd mintzo
bun install
```

---

## Step 2: Set up environment variables

Copy the example file and fill in the values:

```sh
cp .env.example .env
```

Edit `.env` with your keys:

```
# Required - ElevenLabs (TTS voice for exam questions)
EXPO_PUBLIC_ELEVENLABS_API_KEY=sk_...
EXPO_PUBLIC_ELEVENLABS_VOICE_ID=           # Optional - falls back to "Rachel" voice

# Required - ElevenLabs Conversational AI agent IDs (one per exam level for Part 3)
EXPO_PUBLIC_ELEVENLABS_AGENT_ID_B2_PART3=
EXPO_PUBLIC_ELEVENLABS_AGENT_ID_C1_PART3=
EXPO_PUBLIC_ELEVENLABS_AGENT_ID_C2_PART3=

# Required - Supabase project
EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Optional - RevenueCat (empty = subscription features disabled)
EXPO_PUBLIC_REVENUECAT_IOS_KEY=
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=
```

These are `EXPO_PUBLIC_` prefixed variables. They get inlined at build time by Metro, so you must restart Metro (`bun start --clear`) after changing them.

---

## Step 3: Generate the native iOS project

```sh
npx expo prebuild --platform ios --clean
```

This reads `app.json` and its plugins (`expo-router`, `expo-secure-store`, `@livekit/react-native-expo-plugin`, `@config-plugins/react-native-webrtc`) and generates the entire `ios/` directory from scratch, including the Xcode project, Podfile, entitlements, and Info.plist.

The `--clean` flag deletes and regenerates `ios/` completely. Use it when plugins or `app.json` config changes. For incremental changes (just code), you don't need to re-run prebuild.

CocoaPods install runs automatically at the end of prebuild.

---

## Step 4: Configure code signing in Xcode

This is the step that trips people up. You must do this once in the Xcode GUI.

1. Open the workspace (not the project):

```sh
open ios/Mintzo.xcworkspace
```

2. In the left sidebar, click the **Mintzo** project (blue icon at the top).

3. Select the **Mintzo** target (under TARGETS, not PROJECT).

4. Go to the **Signing & Capabilities** tab.

5. Check **Automatically manage signing**.

6. Under **Team**, select your Apple Developer account.
   - If your account is not listed, go to Xcode > Settings > Accounts and add it.
   - For a free account, it will show as "Your Name (Personal Team)".

7. Xcode will automatically create a provisioning profile for `com.mintzo.app`. If it shows a red error about the bundle identifier being taken, you may need to change the bundle ID in `app.json` to something unique (e.g., `com.yourname.mintzo`), then re-run `npx expo prebuild --platform ios --clean` and repeat this step.

**Important:** Every time you run `npx expo prebuild --clean`, the `ios/` directory is deleted and regenerated. The DEVELOPMENT_TEAM setting is NOT stored in `app.json`, so you must re-select your team in Xcode after every clean prebuild. To avoid this, you can add your team ID to `app.json`:

```json
"ios": {
  "bundleIdentifier": "com.mintzo.app",
  "appleTeamId": "YOUR_TEAM_ID"
}
```

You can find your Team ID in Xcode > Settings > Accounts > select your account > look for the Team ID, or in the Apple Developer portal.

---

## Step 5: Connect your iPhone

1. Connect your iPhone to your Mac via USB cable (or ensure both are on the same Wi-Fi for wireless debugging).

2. On the iPhone, tap **Trust** when prompted to trust this computer.

3. In Xcode, select your device from the device dropdown at the top (next to the scheme selector). It should show your phone's name.

4. If this is the first time deploying to this device with this Apple account, you may need to:
   - On iPhone: Go to Settings > General > VPN & Device Management > find your developer certificate > tap Trust.

---

## Step 6: Build and install

### Option A: Build from Xcode (recommended for first build)

1. With the workspace open and your device selected, press **Cmd+B** to build, or **Cmd+R** to build and run.

2. The first build takes 3-5 minutes. Subsequent builds are faster due to caching.

3. If the build succeeds, the app will install and launch on your device automatically.

### Option B: Build from command line (after Xcode has signed once)

After Xcode has successfully built and signed the app at least once (creating the provisioning profile), you can build from the terminal:

```sh
xcodebuild \
  -workspace ios/Mintzo.xcworkspace \
  -scheme Mintzo \
  -configuration Debug \
  -destination 'generic/platform=iOS' \
  -derivedDataPath ios/build \
  DEVELOPMENT_TEAM=YOUR_TEAM_ID \
  CODE_SIGN_IDENTITY="Apple Development" \
  CODE_SIGN_STYLE=Automatic \
  -allowProvisioningUpdates
```

Then install the built app to your connected device:

```sh
xcrun devicectl device install app --device "YOUR-DEVICE-UDID" ios/build/Build/Products/Debug-iphoneos/Mintzo.app
```

To find your device UDID:

```sh
xcrun devicectl list devices
```

---

## Step 7: Start the Metro dev server

In a separate terminal:

```sh
bun start --clear
```

The `--clear` flag resets the Metro cache. Use it after:
- Changing `.env` variables
- Installing/removing native packages
- Running prebuild

The dev client app on your phone will connect to Metro over your local network. Both your Mac and iPhone must be on the same Wi-Fi network.

When the app launches on your phone, it will show the Expo dev client UI. It should auto-discover the Metro server. If not, you can type the URL manually (shown in the Metro terminal output, e.g., `http://192.168.1.x:8081`).

---

## Troubleshooting

### Build fails: "No profiles for 'com.mintzo.app' were found"

You haven't set up code signing yet. Open `ios/Mintzo.xcworkspace` in Xcode and follow Step 4.

### Build fails: provisioning profile error with push notifications

If you see an error about `aps-environment` or push notification entitlements, the `expo-notifications` package may have been re-added. Remove it:

```sh
bun remove expo-notifications
npx expo prebuild --platform ios --clean
```

Then re-do Step 4 (set team in Xcode). Free Apple Developer accounts cannot create push notification entitlements.

Verify the entitlements file is clean after prebuild:

```sh
cat ios/Mintzo/Mintzo.entitlements
```

It should NOT contain `aps-environment`. A clean file looks like:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "...">
<plist version="1.0">
  <dict/>
</plist>
```

### Build fails: "Unable to log in with account"

Xcode's cached authentication token expired. Open Xcode > Settings > Accounts, remove and re-add your Apple ID. Then build from Xcode (Cmd+B) to refresh the signing credentials.

### App installs but crashes immediately

Make sure Metro is running (`bun start --clear`). The dev client needs Metro to load the JavaScript bundle.

### App loads but audio/microphone doesn't work

- Microphone: The app will prompt for microphone permission on first use. Accept it.
- Simulator: Audio features (LiveKit, ElevenLabs TTS) do NOT work on the iOS Simulator. Use a physical device.
- Background audio: If audio stops when the app is backgrounded, verify `UIBackgroundModes: ["audio"]` is in `app.json` and you've prebuilt after adding it.

### Metro shows "event-target-shim" export warning

This is a harmless warning from a transitive dependency of `@livekit/react-native-webrtc`. It resolves correctly via fallback. The `metro.config.js` has `unstable_enablePackageExports = false` to suppress it.

### After `prebuild --clean`, I have to redo Xcode signing every time

Yes. Clean prebuild deletes the entire `ios/` directory. To persist your team ID across prebuilds, add `"appleTeamId"` to `app.json` as described in Step 4.

### RevenueCat errors in logs

If `EXPO_PUBLIC_REVENUECAT_IOS_KEY` is empty or not set, you'll see console warnings like "RevenueCat API key not configured". This is safe to ignore - the app disables subscription features gracefully. Set the key when you're ready to test purchases.

### ElevenLabs voice errors

If `EXPO_PUBLIC_ELEVENLABS_VOICE_ID` is empty, the app uses a fallback voice ("Rachel", ID `21m00Tcm4TlvDq8ikWAM`). You still need a valid `EXPO_PUBLIC_ELEVENLABS_API_KEY` for TTS to work.

---

## Quick reference: common commands

```sh
# Install dependencies
bun install

# Generate native iOS project (first time or after config changes)
npx expo prebuild --platform ios --clean

# Start Metro dev server (clear cache)
bun start --clear

# Build and run on connected device via Expo
bun run ios

# Typecheck
bun run typecheck

# Lint (auto-fix)
bun run lint:fix
```
