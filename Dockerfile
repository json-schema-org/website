# Use Node 20 Alpine base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package files and Yarn config
COPY package*.json .yarnrc.yml yarn.lock ./

# Enable corepack (for yarn)
RUN corepack enable

# Install git, initialize submodules, and install dependencies
RUN apk add --no-cache git && \
    git init && \
    git submodule init && \
    git submodule update && \
    yarn install --immutable

# Copy all project files
COPY . .

# Expose the dev server port
EXPOSE 3000

# Start the development server
CMD ["yarn", "dev"]