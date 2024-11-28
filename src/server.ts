import app from './app';
import {sequelize} from "./config/db";

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
    .then(() => {
        console.log('Database connection established successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
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