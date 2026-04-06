FROM nginx:alpine-slim

# Build arg + env for version (used only as fallback if index.html lacks it)
ARG APP_VERSION=dev
ENV APP_VERSION=${APP_VERSION}

# Ensure envsubst is available for template rendering
RUN apk add --no-cache gettext

# Copy our templated nginx config + entrypoint
COPY nginx.conf.template /etc/nginx/nginx.conf.template
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# PROD bundle -> /usr/share/nginx/html
COPY build/ /usr/share/nginx/html/
# DEV bundle -> /usr/share/nginx/devhtml
COPY devbuild/ /usr/share/nginx/devhtml/
# APEX landing site -> /usr/share/nginx/apexhtml
COPY apex/ /usr/share/nginx/apexhtml/

# Fail the image build if the package-font dirs or top-level fallback triplet are missing.
RUN test -d "/usr/share/nginx/html/assets/packages/font_awesome_flutter/lib/fonts" \
 && test -d "/usr/share/nginx/devhtml/assets/packages/font_awesome_flutter/lib/fonts" \
 && test -f "/usr/share/nginx/html/Font Awesome 7 Brands-Regular-400.otf" \
 && test -f "/usr/share/nginx/html/Font Awesome 7 Free-Regular-400.otf" \
 && test -f "/usr/share/nginx/html/Font Awesome 7 Free-Solid-900.otf" \
 && test -f "/usr/share/nginx/devhtml/Font Awesome 7 Brands-Regular-400.otf" \
 && test -f "/usr/share/nginx/devhtml/Font Awesome 7 Free-Regular-400.otf" \
 && test -f "/usr/share/nginx/devhtml/Font Awesome 7 Free-Solid-900.otf"

EXPOSE 8080
CMD ["/docker-entrypoint.sh"]
