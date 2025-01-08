# Base image for building the application
FROM node:18.16.0-alpine as base

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json if available for more deterministic builds
COPY package.json package-lock.json ./

# Then, we need to install the dependencies inside the base image
RUN npm install

# After installing the dependencies, we need to copy the src folder from our local file into the base image
COPY src ./src

# Copy tsconfig.json to base image too
COPY tsconfig.json ./tsconfig.json

# Then, run the build command, this will compile the ts files into javascript files
RUN npm run build

# Start production image build, we will use the same node image
FROM node:18.16.0-alpine AS production

# Copy only necessary files from the base image
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/dist ./dist

# Expose port 3000, and start the app.
EXPOSE 3000
CMD ["node", "dist/app.js"]