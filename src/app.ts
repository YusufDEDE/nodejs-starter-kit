import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import swaggerUi from "swagger-ui-express";
import {swaggerDocs} from "./swagger";
import userRoutes from "./routes/user.routes";
import dashboardRoutes from "./routes/dashboard.routes";

dotenv.config();
const app = express();

app.use(express.json());

// Serve Swagger UI at "/api-docs"
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/', dashboardRoutes);

export default app;