import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/user.model';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.utils'; // Assuming you have JWT utilities


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Logs in the user
 *     description: Authenticates a user and generates JWT tokens.
 *     responses:
 *       200:
 *         description: Access and refresh tokens issued
 *       400:
 *         description: Invalid login credentials
 */
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({ error: 'User already exists' });
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const newUser = await User.create({
            email,
            password: hashedPassword,
        });

        // Generate JWT tokens
        const accessToken = generateAccessToken({ id: newUser.id, email: newUser.email });
        const refreshToken = generateRefreshToken({ id: newUser.id });

        res.status(201).json({ accessToken, refreshToken });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registers a new user
 *     description: Creates a new user in the database and sends back the response.
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Validation errors
 */
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Compare the password with the hashed password stored in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Generate JWT tokens
        const accessToken = generateAccessToken({ id: user.id, email: user.email });
        const refreshToken = generateRefreshToken({ id: user.id });

        res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
