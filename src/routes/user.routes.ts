import { Router } from 'express';
import {allUsers, getUsers} from '../controllers/user.controller';
import {verifyToken} from "../middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/users/get_users:
 *   get:
 *     summary: Get users registered in the last 2 months
 *     description: Retrieve all users who registered in the last 2 months.
 *     security:
 *       - Bearer: []
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users who registered in the last 2 months
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   email:
 *                     type: string
 *                   name:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Internal server error
 */
router.get('/get_users', verifyToken, getUsers);
/**
 * @swagger
 * /api/users/all_users:
 *   get:
 *     summary: All users registered
 *     description: All users registered.
 *     security:
 *       - Bearer: []
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users who registered all users registered
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   email:
 *                     type: string
 *                   name:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Internal server error
 */
router.get('/all_users', verifyToken, allUsers);

export default router;
