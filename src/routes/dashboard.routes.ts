import { Router } from 'express';
import {verifyToken} from "../middleware/auth.middleware";
import {dashboard} from "../controllers/dashboard.controller";

const router = Router();

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Dashboard view ... required Auth
 *     security:
 *       - Bearer: []
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *       500:
 *         description: Internal server error
 */
router.get('/dashboard', verifyToken, dashboard);


export default router;
