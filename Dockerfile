FROM nginx:alpine-slim

# Copy custom config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy Flutter bundle from repo root to nginx html dir
COPY . /usr/share/nginx/html/

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]