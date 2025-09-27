#!/bin/sh
set -e

log() { echo "[entrypoint] $*"; }

# Extract: const serviceWorkerVersion = "....";
extract_ver() {
  file="$1"
  [ -f "$file" ] || { echo ""; return; }
  # double-quoted, then single-quoted fallback
  ver=$(sed -nE 's/.*serviceWorkerVersion[[:space:]]*=[[:space:]]*"([^"]+)".*/\1/p' "$file" | head -n1)
  [ -n "$ver" ] || ver=$(sed -nE "s/.*serviceWorkerVersion[[:space:]]*=[[:space:]]*'([^']+)'.*/\1/p" "$file" | head -n1)
  echo "$ver"
}

PROD_INDEX="/usr/share/nginx/html/index.html"
DEV_INDEX="/usr/share/nginx/devhtml/index.html"

raw_prod="$(extract_ver "$PROD_INDEX")"
raw_dev="$(extract_ver "$DEV_INDEX")"

# Fall back to $APP_VERSION when not found
if [ -n "$raw_prod" ]; then
  APP_VERSION_PROD="$raw_prod"
  SRC_PROD="index.html"
else
  APP_VERSION_PROD="${APP_VERSION:-dev}"
  SRC_PROD="\$APP_VERSION fallback"
fi

if [ -n "$raw_dev" ]; then
  APP_VERSION_DEV="$raw_dev"
  SRC_DEV="index.html"
else
  APP_VERSION_DEV="${APP_VERSION:-dev}"
  SRC_DEV="\$APP_VERSION fallback"
fi

export APP_VERSION_PROD APP_VERSION_DEV

# Write probe files (handy if you swap nginx location to alias these)
echo -n "$APP_VERSION_PROD" > /usr/share/nginx/html/__app_version  || true
echo -n "$APP_VERSION_DEV"  > /usr/share/nginx/devhtml/__app_version || true

log "Resolved PROD version: $APP_VERSION_PROD (source: $SRC_PROD)"
log "Resolved  DEV version: $APP_VERSION_DEV  (source: $SRC_DEV)"

# Render nginx from template
envsubst '$APP_VERSION_PROD $APP_VERSION_DEV' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

log "Nginx config rendered. Grepping version usage:"
grep -n 'APP_VERSION_' /etc/nginx/nginx.conf || true

exec nginx -g 'daemon off;'
