FROM nginx:alpine-slim

# Copy custom config (overwrites default)
COPY nginx.conf /etc/nginx/nginx.conf

# Copy Flutter static bundle from repo's build/ to nginx html dir
COPY build/ /usr/share/nginx/html/

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]