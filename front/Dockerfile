# Stage 1: Install dependencies
FROM node:20-alpine AS deps

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./

# Install dependencies
RUN npm install

# Stage 2: Build the React app
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the dependencies from the deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the application files
COPY . .

# Build the React app for production
RUN npm run build:prod

# Stage 3: Serve the app
FROM node:20-alpine AS runner

# Set the working directory inside the container
WORKDIR /app

# Install serve for serving static files
RUN npm install -g serve

# Copy the build output from the builder stage
COPY --from=builder /app/build /app/build

# Expose the port
EXPOSE 3000

# Serve the app using serve
CMD ["serve", "-s", "build", "-l", "3000"]
