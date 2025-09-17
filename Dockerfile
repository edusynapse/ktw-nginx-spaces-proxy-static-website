FROM nginx:alpine-slim
# Copy custom config
COPY nginx.conf /etc/nginx/nginx.conf
# No other files—proxy only
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]