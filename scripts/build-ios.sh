#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "=== Mintzo iOS Build ==="
echo ""

# Step 1: Check prerequisites
echo "[1/5] Checking prerequisites..."

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
echo "[2/5] Installing dependencies..."
bun install
echo ""

# Step 3: Run checks
echo "[3/5] Running typecheck..."
bun run typecheck
echo "  Typecheck passed."
echo ""

# Step 4: Choose target
echo "[4/5] Select build target:"
echo ""
echo "  1) Physical device (plugged in via USB)"
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
    echo "[5/5] Building for device..."
    npx expo run:ios --device
    ;;
  2)
    echo ""
    echo "[5/5] Building for simulator..."
    npx expo run:ios
    ;;
  *)
    echo "Invalid choice. Exiting."
    exit 1
    ;;
esac

echo ""
echo "Done."
