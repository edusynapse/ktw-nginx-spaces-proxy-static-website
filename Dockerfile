FROM nginx:alpine-slim

# Copy custom config (overwrites default)
COPY nginx.conf /etc/nginx/nginx.conf

# PROD bundle -> /usr/share/nginx/html
COPY build/ /usr/share/nginx/html/

# DEV bundle -> /usr/share/nginx/devhtml
COPY devbuild/ /usr/share/nginx/devhtml/

# Log presence of fonts in both bundles (appears in App Platform build logs)
RUN ls -la /usr/share/nginx/html/assets/packages/font_awesome_flutter/lib/fonts/ || echo "PROD: Fonts dir missing"
RUN ls -la /usr/share/nginx/html/ | grep "Font Awesome" || echo "PROD: No top-level Font Awesome files"

RUN ls -la /usr/share/nginx/devhtml/assets/packages/font_awesome_flutter/lib/fonts/ || echo "DEV: Fonts dir missing"
RUN ls -la /usr/share/nginx/devhtml/ | grep "Font Awesome" || echo "DEV: No top-level Font Awesome files"

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
