#!/bin/sh
set -e

log() { echo "[entrypoint] $*"; }

# Extract: const serviceWorkerVersion = "....";
extract_ver() {
  file="$1"
  [ -f "$file" ] || { echo ""; return; }
  # double-quoted, then single-quoted fallback
  ver=$(sed -n -r 's/.*serviceWorkerVersion[[:space:]]*=[[:space:]]*"([^"]+)".*/\1/p' "$file" | head -n1)
  [ -n "$ver" ] || ver=$(sed -n -r "s/.*serviceWorkerVersion[[:space:]]*=[[:space:]]*'([^']+)'.*/\1/p" "$file" | head -n1)
  echo "$ver"
}

# Add ?version=<ver> to asset/worker/image URLs in index.html (idempotent)
# - Only touches paths under /workers, /assets, /icons
# - Skips any URL that already has a '?' (so we don't double-append)
# - Patches <link rel=preload href="...">, inline CSS background-image, and <img src="...">
versionize_index() {
  ver="$1"; file="$2"
  [ -f "$file" ] || { log "skip versionize (missing): $file"; return 0; }

  log "Versionizing assets in $file with ?version=${ver}"

  # A) <link rel="preload" href="/(workers|assets|icons)/...">
  # Only if href has no existing ? or # segment
  sed -r -i \
    "s|(rel=\"preload\"[^>]*href=\")(/(workers|assets|icons)/[^\"?#]+)([\"#])|\\1\\2?version=${ver}\\4|g" \
    "$file"

  # B) Inline body background-image: url(/assets/...)
  sed -r -i \
    "s|(background-image:[^;]*url\\()([\"']?)/(assets/[^\"')?#]+)([\"']?\\))|\\1\\2\\3?version=${ver}\\4|g" \
    "$file"

  # C) <img src="/(assets|icons)/...">
  sed -r -i \
    "s|(src=\")(/(assets|icons)/[^\"?#]+)(\")|\\1\\2?version=${ver}\\4|g" \
    "$file"
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

# Inject ?version=... into asset/worker/image URLs in both HTMLs
versionize_index "$APP_VERSION_PROD" "$PROD_INDEX"
versionize_index "$APP_VERSION_DEV"  "$DEV_INDEX"

# Render nginx from template
envsubst '$APP_VERSION_PROD $APP_VERSION_DEV' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

log "Nginx config rendered. Grepping version usage:"
grep -n 'APP_VERSION_' /etc/nginx/nginx.conf || true

exec nginx -g 'daemon off;'
