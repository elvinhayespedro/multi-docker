FROM node:16-alpine as builder

# WORKDIR
RUN mkdir -p /usr/app/client
WORKDIR /usr/app/client

COPY ./package.json ./
RUN npm install

COPY ./ ./
RUN npm run build

FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/app/client/build /usr/share/nginx/html