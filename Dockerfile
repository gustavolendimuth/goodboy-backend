FROM node:16.14-alpine
WORKDIR /api
COPY package*.json .
RUN npm install
COPY . .
ENTRYPOINT [ "npm", "run", "setup" ]