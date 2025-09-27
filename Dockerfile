FROM nginx:alpine-slim

# Build arg + env for version (used only as fallback if index.html lacks it)
ARG APP_VERSION=dev
ENV APP_VERSION=${APP_VERSION}

# Copy our templated nginx config + entrypoint
COPY nginx.conf.template /etc/nginx/nginx.conf.template
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# PROD bundle -> /usr/share/nginx/html
COPY build/ /usr/share/nginx/html/
# DEV bundle -> /usr/share/nginx/devhtml
COPY devbuild/ /usr/share/nginx/devhtml/

# Optional: quick visibility in DO build logs
RUN ls -la /usr/share/nginx/html/assets/packages/font_awesome_flutter/lib/fonts/ || echo "PROD: Fonts dir missing" \
 && ls -la /usr/share/nginx/devhtml/assets/packages/font_awesome_flutter/lib/fonts/ || echo "DEV: Fonts dir missing"

EXPOSE 8080
CMD ["/docker-entrypoint.sh"]
