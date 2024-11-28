import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/user.model';
import client from '../config/redis';
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
// Login handler (with Redis token storage)
export const login = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    // Check if the user exists in the database
    const user = await User.findOne({ where: { email } });

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Compare the provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate access and refresh tokens
    const accessToken = generateAccessToken({ id: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ id: user.id });

    // Store the refresh token in Redis with the user id as the key
    await client.set(user.id.toString(), refreshToken);

    // Send the tokens back in the response
    res.status(200).json({
        message: 'Login success',
        accessToken,
        refreshToken,
    });
};


// Logout handler (remove tokens from Redis)
export const logout = async (req: Request, res: Response): Promise<any> => {
    // @ts-ignore
    const { user } = req; // Access the user property after the middleware sets it

    if (!user) {
        return res.status(400).json({ error: 'No user to log out' });
    }

    // Remove the refresh token from Redis
    await client.del(user.id.toString());

    res.status(200).json({ message: 'Logged out successfully' });
};