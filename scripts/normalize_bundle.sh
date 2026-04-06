#!/usr/bin/env bash
set -euo pipefail

BUNDLE_DIR=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --bundle-dir)
      BUNDLE_DIR="$2"
      shift 2
      ;;
    *)
      echo "Unknown arg: $1" >&2
      exit 1
      ;;
  esac
done

[[ -n "$BUNDLE_DIR" ]] || { echo "ERROR: --bundle-dir is required" >&2; exit 1; }
[[ -d "$BUNDLE_DIR" ]] || { echo "ERROR: bundle dir not found: $BUNDLE_DIR" >&2; exit 1; }

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OVERRIDE_ROOT="$REPO_ROOT/bundle_overrides/common"
FONT_ROOT="$REPO_ROOT/bundle_overrides/font_fallback"
SW_FILE="$BUNDLE_DIR/flutter_service_worker.js"

copy_override() {
  local rel="$1"
  local src="$OVERRIDE_ROOT/$rel"
  local dst="$BUNDLE_DIR/$rel"

  [[ -f "$src" ]] || { echo "ERROR: missing override file: $src" >&2; exit 1; }
  mkdir -p "$(dirname "$dst")"
  cp -f "$src" "$dst"
}

sync_sw_hash_if_present() {
  local rel="$1"
  local file="$BUNDLE_DIR/$rel"
  local hash

  [[ -f "$SW_FILE" ]] || return 0
  [[ -f "$file" ]] || return 0
  grep -Fq "\"$rel\":" "$SW_FILE" || return 0

  hash="$(md5sum "$file" | awk '{print $1}')"
  perl -0pi -e 's#"\Q'"$rel"'\E":\s*"[^"]*"#"'"$rel"'": "'"$hash"'"#g' "$SW_FILE"
}

copy_override "robots.txt"
sync_sw_hash_if_present "robots.txt"

copy_override "sitemap.xml"
sync_sw_hash_if_present "sitemap.xml"

copy_override "sitemap-index.xml"
sync_sw_hash_if_present "sitemap-index.xml"

copy_override ".well-known/assetlinks.json"
sync_sw_hash_if_present ".well-known/assetlinks.json"

if [[ -d "$FONT_ROOT" ]]; then
  while IFS= read -r -d '' font_file; do
    cp -f "$font_file" "$BUNDLE_DIR/"
  done < <(find "$FONT_ROOT" -maxdepth 1 -type f -name '*.otf' -print0 | sort -z)
fi

echo "[normalize] bundle normalized: $BUNDLE_DIR"
