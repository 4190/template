# Stage 1: Build Angular app
FROM node:20-alpine AS build
WORKDIR /app
# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci
# Copy app source code and build
COPY . .
RUN npm run build -- --output-path=dist
# Stage 2: Serve with nginx
FROM nginx:stable-alpine
# Copy Angular build output to nginx html dir
COPY --from=build /app/dist/ /usr/share/nginx/html
# Optional: Copy custom nginx config if you have one
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose HTTP port
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
