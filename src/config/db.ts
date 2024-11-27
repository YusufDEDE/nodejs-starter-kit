import { Sequelize } from 'sequelize';

// Read environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

// Setup Sequelize connection to Postgres SQL
export const sequelize = new Sequelize(
    process.env.PG_DATABASE || 'nodejs-starter-kit',    // Database name
    process.env.PG_USER || 'docker_user',    // Database user
    process.env.PG_PASSWORD || 'docker_user',  // Database password
    {
        port: Number(process.env.PG_PORT),
        host: process.env.PG_HOST || 'localhost',   // Database host
        dialect: 'postgres',    // Using Postgres SQL as the database
        logging: false,         // Disable logging SQL queries
        pool: {
            max: 5,              // Maximum number of connections in pool
            min: 0,              // Minimum number of connections in pool
            acquire: 30000,      // Max time (in ms) to wait for a connection before throwing an error
            idle: 10000          // Max time (in ms) a connection can be idle before being released
        },
    }
);

