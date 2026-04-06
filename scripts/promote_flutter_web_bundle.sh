#!/usr/bin/env bash
set -euo pipefail

SOURCE_DIR=""
DEST_DIR=""
EXPECTED_API_BASE=""
EXPECTED_APP_ORIGIN=""
EXPECTED_CANONICAL=""
FORBID_HOSTS=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --source-dir)
      SOURCE_DIR="$2"
      shift 2
      ;;
    --dest-dir)
      DEST_DIR="$2"
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

[[ -n "$SOURCE_DIR" ]] || { echo "ERROR: --source-dir is required" >&2; exit 1; }
[[ -n "$DEST_DIR" ]] || { echo "ERROR: --dest-dir is required" >&2; exit 1; }
[[ -n "$EXPECTED_API_BASE" ]] || { echo "ERROR: --expected-api-base is required" >&2; exit 1; }
[[ -n "$EXPECTED_APP_ORIGIN" ]] || { echo "ERROR: --expected-app-origin is required" >&2; exit 1; }
[[ -d "$SOURCE_DIR" ]] || { echo "ERROR: source dir not found: $SOURCE_DIR" >&2; exit 1; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

mkdir -p "$DEST_DIR"
rsync -a --delete "$SOURCE_DIR"/ "$DEST_DIR"/

"$SCRIPT_DIR/normalize_bundle.sh" --bundle-dir "$DEST_DIR"

VALIDATE_ARGS=(
  --bundle-dir "$DEST_DIR"
  --expected-api-base "$EXPECTED_API_BASE"
  --expected-app-origin "$EXPECTED_APP_ORIGIN"
)

if [[ -n "$EXPECTED_CANONICAL" ]]; then
  VALIDATE_ARGS+=(--expected-canonical "$EXPECTED_CANONICAL")
fi

for forbidden in "${FORBID_HOSTS[@]}"; do
  VALIDATE_ARGS+=(--forbid-host "$forbidden")
done

"$SCRIPT_DIR/validate_bundle.sh" "${VALIDATE_ARGS[@]}"

echo "[promote] promoted $SOURCE_DIR -> $DEST_DIR"
