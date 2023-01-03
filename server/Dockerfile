# server image
FROM node:14.14.0-alpine

# WORKDIR
RUN mkdir -p /usr/app/api
WORKDIR /usr/app/api

COPY ./package.json ./
RUN npm install

COPY ./ ./
CMD ["npm", "run", "start"]