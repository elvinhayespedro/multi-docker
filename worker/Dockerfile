# server image
FROM node:14.14.0-alpine

# WORKDIR
RUN mkdir -p /usr/app/worker
WORKDIR /usr/app/worker

COPY ./package.json ./
RUN npm install

COPY ./ ./
CMD ["npm", "run", "start"]