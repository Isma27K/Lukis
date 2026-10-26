#!/usr/bin/env bash
# Builds the Excalidraw editor from the local clone and installs it into this
# app as packed tarballs. Rerun after changing anything in the clone.
#
# Tarballs (not file:/symlink deps) are used because the editor pins its
# internal packages at versions that aren't published on npm, and a symlinked
# package would resolve a second copy of React from the clone's node_modules.
set -euo pipefail

FRONTEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
EXCALIDRAW_DIR="$(cd "${EXCALIDRAW_DIR:-$FRONTEND_DIR/../excalidraw}" && pwd)"
VENDOR_DIR="$FRONTEND_DIR/vendor/excalidraw"
FONTS_DIR="$FRONTEND_DIR/public/fonts"
PACKAGES=(common element math fractional-indexing laser-pointer excalidraw)

echo "› Building packages in $EXCALIDRAW_DIR"
if [ ! -d "$EXCALIDRAW_DIR/node_modules" ]; then
  yarn --cwd "$EXCALIDRAW_DIR" install
fi
yarn --cwd "$EXCALIDRAW_DIR" build:packages

echo "› Packing into $VENDOR_DIR"
rm -rf "$VENDOR_DIR"
mkdir -p "$VENDOR_DIR"
tarballs=()
for pkg in "${PACKAGES[@]}"; do
  tarball="$(npm pack "$EXCALIDRAW_DIR/packages/$pkg" \
    --pack-destination "$VENDOR_DIR" --silent | tail -n 1)"
  tarballs+=("./vendor/excalidraw/$tarball")
done

echo "› Copying fonts to $FONTS_DIR"
rm -rf "$FONTS_DIR"
cp -r "$EXCALIDRAW_DIR/packages/excalidraw/dist/prod/fonts" "$FONTS_DIR"

echo "› Installing tarballs"
# Naming the tarballs explicitly makes npm re-read them, so package-lock.json
# picks up the new integrity hashes even though the file names don't change.
cd "$FRONTEND_DIR"
npm install "${tarballs[@]}"

echo "✓ Excalidraw installed from $EXCALIDRAW_DIR"
