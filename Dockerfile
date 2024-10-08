FROM node:18.18.2

ARG APP_DIR=app
RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}

COPY package*.json ./

RUN npm install

COPY . ./

CMD npm prod:start