#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "=== Mintzo iOS Build ==="
echo ""

# Step 1: Check prerequisites
echo "[1/4] Checking prerequisites..."

if ! command -v bun &>/dev/null; then
  echo "Error: bun is not installed. Install it: https://bun.sh"
  exit 1
fi

if ! command -v pod &>/dev/null; then
  echo "Error: CocoaPods is not installed. Install it: gem install cocoapods"
  exit 1
fi

echo "  bun: $(bun --version)"
echo "  pod: $(pod --version)"
echo ""

# Step 2: Install JS dependencies
echo "[2/4] Installing dependencies..."
bun install
echo ""

# Step 3: Run checks
echo "[3/4] Running typecheck..."
bun run typecheck
echo "  Typecheck passed."
echo ""

# Step 4: Choose target
echo "[4/4] Select build target:"
echo ""
echo "  1) Physical device (USB) - first time setup"
echo "  2) Simulator"
echo ""
read -rp "Choice [1/2]: " choice

case "${choice}" in
  1)
    echo ""
    echo "Make sure your iPhone is:"
    echo "  - Connected via USB"
    echo "  - Unlocked"
    echo "  - Developer Mode enabled (Settings > Privacy & Security > Developer Mode)"
    echo ""
    read -rp "Press Enter when ready..."
    echo ""
    echo "Building for device..."
    npx expo run:ios --device
    echo ""
    echo "Build installed. For future JS-only changes, skip this script and run:"
    echo "  npx expo start --dev-client"
    echo ""
    echo "Your phone will connect to Metro over WiFi - no cable needed."
    ;;
  2)
    echo ""
    echo "Building for simulator..."
    npx expo run:ios
    ;;
  *)
    echo "Invalid choice. Exiting."
    exit 1
    ;;
esac

echo ""
echo "Done."
