import {Router} from 'express';
import {login, logout, refresh, register} from '../controllers/auth.controller';
import {verifyToken} from "../middleware/auth.middleware";

const router = Router();
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login an existing user
 *     description: Logs in a user and returns an access token and refresh token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: abc123accessToken
 *                 refreshToken:
 *                   type: string
 *                   example: xyz789refreshToken
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user in the system.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid data
 *       500:
 *         description: Internal server error
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Log out the user by removing the refresh token from Redis.
 *     description: Logs out the user and deletes the refresh token stored in Redis.
 *     tags: [Auth]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       400:
 *         description: No user to log out
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.post('/refresh', verifyToken, refresh);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Log out the user by removing the refresh token from Redis.
 *     description: Logs out the user and deletes the refresh token stored in Redis.
 *     tags: [Auth]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       400:
 *         description: No user to log out
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.post('/logout', verifyToken, logout);

export default router;