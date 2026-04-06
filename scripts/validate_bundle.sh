#!/usr/bin/env bash
set -euo pipefail

BUNDLE_DIR=""
EXPECTED_API_BASE=""
EXPECTED_APP_ORIGIN=""
EXPECTED_CANONICAL=""
FORBID_HOSTS=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --bundle-dir)
      BUNDLE_DIR="$2"
      shift 2
      ;;
    --expected-api-base)
      EXPECTED_API_BASE="$2"
      shift 2
      ;;
    --expected-app-origin)
      EXPECTED_APP_ORIGIN="${2%/}"
      shift 2
      ;;
    --expected-canonical)
      EXPECTED_CANONICAL="${2%/}"
      shift 2
      ;;
    --forbid-host)
      FORBID_HOSTS+=("$2")
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
[[ -n "$EXPECTED_API_BASE" ]] || { echo "ERROR: --expected-api-base is required" >&2; exit 1; }

INDEX_FILE="$BUNDLE_DIR/index.html"
SW_FILE="$BUNDLE_DIR/flutter_service_worker.js"

[[ -f "$INDEX_FILE" ]] || { echo "ERROR: missing index.html in $BUNDLE_DIR" >&2; exit 1; }
[[ -f "$SW_FILE" ]] || { echo "ERROR: missing flutter_service_worker.js in $BUNDLE_DIR" >&2; exit 1; }
[[ -f "$BUNDLE_DIR/main.dart.js" || -f "$BUNDLE_DIR/main.dart.mjs" ]] || {
  echo "ERROR: missing main.dart.js/main.dart.mjs in $BUNDLE_DIR" >&2
  exit 1
}

SW_VERSION="$(sed -n -r 's/.*serviceWorkerVersion[[:space:]]*=[[:space:]]*"([^"]+)".*/\1/p' "$INDEX_FILE" | head -n1)"
if [[ -z "$SW_VERSION" ]]; then
  SW_VERSION="$(sed -n -r "s/.*serviceWorkerVersion[[:space:]]*=[[:space:]]*'([^']+)'.*/\1/p" "$INDEX_FILE" | head -n1)"
fi
[[ -n "$SW_VERSION" ]] || { echo "ERROR: could not parse serviceWorkerVersion from $INDEX_FILE" >&2; exit 1; }

grep -Fq '<meta name="robots" content="noindex, nofollow">' "$INDEX_FILE" || {
  echo "ERROR: noindex meta missing in $INDEX_FILE" >&2
  exit 1
}

if [[ -n "$EXPECTED_CANONICAL" ]]; then
  grep -Fq "<link rel=\"canonical\" href=\"${EXPECTED_CANONICAL}/\">" "$INDEX_FILE" || {
    echo "ERROR: canonical link does not match ${EXPECTED_CANONICAL}/ in $INDEX_FILE" >&2
    exit 1
  }
fi

if ! grep -rql --text --include='*.js' --include='*.mjs' --include='*.wasm' \
    "$EXPECTED_API_BASE" "$BUNDLE_DIR" 2>/dev/null; then
  echo "ERROR: expected API base not found in compiled bundle: $EXPECTED_API_BASE" >&2
  exit 1
fi

for forbidden in "${FORBID_HOSTS[@]}"; do
  if grep -rql --text "$forbidden" "$BUNDLE_DIR" 2>/dev/null; then
    echo "ERROR: forbidden host found in bundle: $forbidden" >&2
    exit 1
  fi
done

if [[ -n "$EXPECTED_APP_ORIGIN" ]]; then
  grep -rql --text --include='*.js' --include='*.mjs' \
    "${EXPECTED_APP_ORIGIN}/__force_update__" "$BUNDLE_DIR" 2>/dev/null || {
      echo "ERROR: expected hard-refresh endpoint not found for $EXPECTED_APP_ORIGIN" >&2
      exit 1
    }

  if ! grep -rEq --text --include='*.js' --include='*.mjs' \
      "${EXPECTED_APP_ORIGIN}/(#/)?signup\\?referral_code=" "$BUNDLE_DIR" 2>/dev/null; then
    echo "ERROR: expected referral/signup host not found for $EXPECTED_APP_ORIGIN" >&2
    exit 1
  fi
fi

[[ -f "$BUNDLE_DIR/robots.txt" ]] || { echo "ERROR: robots.txt missing in $BUNDLE_DIR" >&2; exit 1; }
grep -Fq 'Disallow: /' "$BUNDLE_DIR/robots.txt" || {
  echo "ERROR: robots.txt does not disallow crawl in $BUNDLE_DIR" >&2
  exit 1
}

[[ -f "$BUNDLE_DIR/.well-known/assetlinks.json" ]] || {
  echo "ERROR: assetlinks.json missing in $BUNDLE_DIR/.well-known" >&2
  exit 1
}

for rel in "robots.txt" "sitemap.xml" ".well-known/assetlinks.json"; do
  if [[ -f "$BUNDLE_DIR/$rel" ]] && grep -Fq "\"$rel\":" "$SW_FILE"; then
    expected_hash="$(md5sum "$BUNDLE_DIR/$rel" | awk '{print $1}')"
    actual_hash="$(sed -n -E "s/.*\"${rel//\//\\/}\": \"([^\"]+)\".*/\\1/p" "$SW_FILE" | head -n1)"
    [[ "$actual_hash" == "$expected_hash" ]] || {
      echo "ERROR: flutter_service_worker.js hash mismatch for $rel" >&2
      exit 1
    }
  fi
done

if [[ -f "$BUNDLE_DIR/sitemap.xml" ]] && grep -Fq 'knowtowin.com' "$BUNDLE_DIR/sitemap.xml"; then
  echo "ERROR: sitemap.xml still advertises knowtowin.com in $BUNDLE_DIR" >&2
  exit 1
fi

if [[ -f "$BUNDLE_DIR/sitemap-index.xml" ]] && grep -Fq 'knowtowin.com' "$BUNDLE_DIR/sitemap-index.xml"; then
  echo "ERROR: sitemap-index.xml still advertises knowtowin.com in $BUNDLE_DIR" >&2
  exit 1
fi

echo "[validate] bundle ok: $BUNDLE_DIR (serviceWorkerVersion=$SW_VERSION)"
