FROM node:16.14-alpine
WORKDIR /api
COPY package*.json .
RUN yarn install
COPY . .
ENTRYPOINT [ "npm", "run", "start" ]