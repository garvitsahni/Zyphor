# Unified Dockerfile for Zyphor (Backend)
# Built for Render deployment from the project root

FROM node:20-slim

WORKDIR /app

# Copy the backend package files
COPY backend/package*.json ./

# Install production dependencies
RUN npm install --production

# Copy all backend source code
COPY backend/ ./

# Standard port for Render is 10000
# The backend uses process.env.PORT || 5000
ENV PORT=10000
EXPOSE 10000

# Start the application
CMD ["npm", "start"]
