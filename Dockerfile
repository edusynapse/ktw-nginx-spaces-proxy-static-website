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

EXPOSE 8080
CMD ["/docker-entrypoint.sh"]
