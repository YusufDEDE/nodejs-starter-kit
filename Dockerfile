# Use the official Node.js 22 Alpine image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Install dependencies for TypeScript (if needed)
RUN apk add --no-cache bash git

# Copy package.json and package-lock.json (or yarn.lock) into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Install TypeScript globally (if you need it globally)
RUN npm install -g typescript

# Build TypeScript project (if you have a build step)
RUN tsc

# Expose the port your application will run on (adjust as necessary)
EXPOSE 3000

# Command to run your application
CMD ["node", "dist/server.js"]
