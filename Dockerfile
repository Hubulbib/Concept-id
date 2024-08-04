FROM node:18.18.2

WORKDIR /usr/src/app/server

COPY ./package.json .

RUN npm install

COPY . .

CMD ["npm", "prod:start"]