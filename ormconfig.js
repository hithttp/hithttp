module.exports = {
    "type": "postgres",
    "host": "localhost",
    "port": "5432",
    "username": "postgres",
    "password": "root",
    "database": "hithttp",
    "entities": ["src/entity/*.js"],
    "migrationsTableName": "migration_table",
    "migrations": ["src/migration/*.ts"],
    "cli": {
        "migrationsDir": "migration"
    }
 }