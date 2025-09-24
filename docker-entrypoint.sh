#!/bin/sh
set -e
: "${APP_VERSION:=dev}"

# Render nginx from template with APP_VERSION injected
envsubst '$APP_VERSION' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Show it once (debug)
echo "---- Using APP_VERSION=$APP_VERSION ----"
grep -n 'APP_VERSION' -n /etc/nginx/nginx.conf || true

exec nginx -g 'daemon off;'
