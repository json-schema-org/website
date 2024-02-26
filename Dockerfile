FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN git submodule init && git submodule update && yarn

COPY . .

EXPOSE 3000

CMD yarn dev
