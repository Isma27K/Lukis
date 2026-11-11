#!/usr/bin/env bash
# Builds the editor from the local clone of our Excalidraw fork (the `lukis`
# branch of isma27k/lukis-editor) and installs it into this app as packed
# tarballs. Rerun after committing anything in the clone.
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

# CI builds the commit recorded below from the fork, so building anything
# that isn't committed there would ship a different editor than you tested.
# CI itself checks out a clean commit, so this never trips there.
if [ -n "$(git -C "$EXCALIDRAW_DIR" status --porcelain -- packages)" ]; then
  echo "✗ $EXCALIDRAW_DIR has uncommitted changes in packages/." >&2
  echo "  Commit them on the fork's lukis branch first (CI builds commits only)." >&2
  exit 1
fi

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

echo "› Recording the commit in .excalidraw-ref"
# CI checks out the fork at this commit to build the same editor, so push it
# before pushing this repo.
git -C "$EXCALIDRAW_DIR" rev-parse HEAD > "$FRONTEND_DIR/.excalidraw-ref"

echo "› Copying fonts to $FONTS_DIR"
rm -rf "$FONTS_DIR"
cp -r "$EXCALIDRAW_DIR/packages/excalidraw/dist/prod/fonts" "$FONTS_DIR"

echo "› Installing tarballs"
# Naming the tarballs explicitly makes npm re-read them, so package-lock.json
# picks up the new integrity hashes even though the file names don't change.
cd "$FRONTEND_DIR"
npm install "${tarballs[@]}"

echo "✓ Excalidraw installed from $EXCALIDRAW_DIR"
