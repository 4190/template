# Stage 1: Build Angular app
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# This build command creates the dist/browser directory structure
RUN npm run build -- --output-path=dist

# Stage 2: Serve with nginx
FROM nginx:stable-alpine
# --- THIS IS THE CORRECTED LINE ---
# Copy the *contents* of the 'browser' folder to the NGINX web root
COPY --from=build /app/dist/browser /usr/share/nginx/html
# Copy your custom NGINX config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose HTTP port
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
