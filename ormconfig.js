
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const dbName = process.env.DB_NAME;
const testDbName = process.env.TEST_DB_NAME;

module.exports = [
  {
     "name": "default",
     "type": "mysql",
     "host": host,
     "port": port,
     "username": user,
     "password": pass,
     "database": dbName,
     "synchronize": true,
     "logging": false,
     "entities": [
        "dist/**/*.entity.js"
     ],
     "migrations": [
        "dist/migrations/*.js"
     ],
     "subscribers": [
        "dist/**/*.subscriber.js"
     ],
     "cli": {
        "migrationsDir": "src/migrations"
     }
  },
  {
     "name": "test",
     "type": "mysql",
     "host": host,
     "port": port,
     "username": user,
     "password": pass,
     "database": testDbName,
     "synchronize": true,
     "logging": false,
     "entities": [
        "src/**/*.entity.ts"
     ],
     "migrations": [
        "dist/migrations/*.js"
     ],
     "subscribers": [
        "dist/**/*.subscriber.js"
     ],
     "cli": {
        "migrationsDir": "src/migrations"
     }
  }
]