FROM nginx:alpine-slim

# Copy custom config (overwrites default)
COPY nginx.conf /etc/nginx/nginx.conf

# Copy Flutter static bundle from repo's build/ to nginx html dir
COPY build/ /usr/share/nginx/html/

# Log files in fonts dir (appears in App Platform build logs)
RUN ls -la /usr/share/nginx/html/assets/packages/font_awesome_flutter/lib/fonts/ || echo "Fonts dir missing"
RUN ls -la /usr/share/nginx/html/ | grep "Font Awesome" || echo "No top-level Font Awesome files"

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]