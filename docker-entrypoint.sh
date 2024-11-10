#!/bin/sh

# Ожидание готовности базы данных
/wait-for-it.sh postgres:5432 -t 60

# Запуск миграций
echo "Running database migrations..."
cd /app && npx knex migrate:latest

# Запуск приложения
echo "Starting application..."
npm run start