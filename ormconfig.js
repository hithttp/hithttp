module.exports = {
    "type": "postgres",
    "host": process.env.DATABASE_URL,
    "username": process.env.DATABASE_USER,
    "password": process.env.DATABASE_PASSWORD,
    "database": process.env.DATABASE_NAME,
    "entities": ["src/entity/*.js"],
    "migrationsTableName": "migration_table",
    "migrations": ["src/migration/*.ts"],
    "cli": {
        "migrationsDir": "migration"
    }
 }