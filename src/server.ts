import app from './app';
import {sequelize} from "./config/db";
import getRedisClient from "./config/redis";

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
    .then(() => {
        console.log('Database connection established successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
        process.exit(0);
    });


sequelize.sync()  // Sync all models to the DB (create tables if they do not exist)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error during database synchronization:', error);
    });

const shutdown = async () => {
    const redisClient = getRedisClient();
    await redisClient.quit();
    console.log('Redis connection closed');

    await sequelize.close();
    console.log('Postgres SQL connection closed');

    process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);