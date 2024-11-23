FROM node:22-alpine

# Set a directory for the app
WORKDIR /usr/src/app

# Copy app files into the workdir
COPY . .

# Run these commands while building the image
RUN npm install

RUN npm run build

# Run these commands when the container starts
CMD npm run serve

EXPOSE 4173