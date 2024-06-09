# Use Node.js 14 as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Expose port 8000 (or the port your application is running on)
EXPOSE 8000

# Command to run your application
CMD ["npm", "start"]
