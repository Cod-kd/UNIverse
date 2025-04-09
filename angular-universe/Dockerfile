# Stage 1: Build the Angular application

FROM node:18.19-alpine AS builder


# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the application source code
COPY . .

# Build the application
RUN npm run build --prod

# Stage 2: Serve the built application using Nginx
FROM nginx:alpine

# Copy the built application from the builder stage
COPY --from=builder /app/dist/angular-universe/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

# To build:
# docker build -t paco7828/frontend-universe . --progress=plain