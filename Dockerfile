FROM node:20-alpine

WORKDIR /app

# Установка зависимостей для сборки
RUN apk add --no-cache python3 make g++

# Копирование только package.json
COPY package.json ./

# Удаление существующего package-lock.json и создание нового
RUN rm -f package-lock.json && npm install

# Копирование всего исходного кода и миграций
COPY . .

# Компиляция TypeScript
RUN npm run build

# Установка knex глобально
RUN npm install -g knex

# Установка wait-for-it
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Скрипт для запуска миграций и приложения
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]