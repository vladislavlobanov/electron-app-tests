#!/bin/bash

# Variables
APP_NAME="MongoDB Query Executor"
# ./MongoDB Query Executor/1.0.7-20250106.0/MongoDB Query Executor-Mac-1.0.7-20250106.0-Installer.dmg
DMG_FILE=$(find . -name "*.dmg" -print -quit)
# MongoDB Query Executor-Mac-1.0.7-20250106.0-Installer.dmg
MOUNT_NAME=$(basename "$dmg_file")
# /Volumes/MongoDB Query Executor 1.0.7-20250106.0-arm64
MOUNT_DIR="/Volumes/$APP_NAME"

# DMG_URL="https://github.com/vaisakhsasikumar/my-electron-app/releases/download/v1.0.0/MongoDB-Query-Executor-Mac-1.0.0-Installer.dmg"

# Step 1: Download the DMG file
# echo "Downloading DMG..."
# curl -L $DMG_URL -o $DMG_FILE

# Step 2: Mount the DMG
echo "Mounting DMG..."
hdiutil attach $DMG_FILE -nobrowse -quiet

# Step 3: Copy the app to Applications
echo "Copying app to Applications..."
cd "$MOUNT_DIR"
ls
cp -R "$MOUNT_DIR/$APP_NAME.app" /Applications/

# Step 4: Unmount the DMG
echo "Unmounting DMG..."
hdiutil detach "$MOUNT_DIR" -quiet

# Step 5: Verify the app exists
if [ -d "/Applications/$APP_NAME.app" ]; then
  # Fix warnings from Non App Store applications
  xattr -c "/Applications/$APP_NAME.app"
  echo "$APP_NAME installed successfully!"
else
  echo "Installation failed!"
  exit 1
fi
