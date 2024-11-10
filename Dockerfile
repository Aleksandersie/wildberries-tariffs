FROM node:20-alpine

WORKDIR /app


RUN apk add --no-cache python3 make g++


COPY package.json ./


RUN rm -f package-lock.json && npm install


COPY . .

RUN npm run build


RUN npm install -g knex


ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh


COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]