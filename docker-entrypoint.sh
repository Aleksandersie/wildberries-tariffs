
/wait-for-it.sh postgres:5432 -t 60


echo "Running database migrations..."
cd /app && npx knex migrate:latest


echo "Starting application..."
npm run start