import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/user.model';
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from '../utils/jwt.utils';
import getRedisClient from "../config/redis";

const redisClient = getRedisClient();

// Helper function to find user by email
const findUserByEmail = async (email: string) => {
    return User.findOne({ where: { email } });
};

// Helper function to hash password
const hashPassword = async (password: string) => {
    return bcrypt.hash(password, 10);
};

// Helper function to compare password
const comparePassword = async (password: string, hashedPassword: string) => {
    return bcrypt.compare(password, hashedPassword);
};

// Helper function to generate and store tokens
const generateAndStoreTokens = async (user: any) => {
    const accessToken = generateAccessToken({ id: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ id: user.id });

    // Store refresh token in Redis with an expiration time
    await redisClient.set(`refresh:${user.id}`, refreshToken, 'EX', 7 * 24 * 60 * 60); // 7 days

    return { accessToken, refreshToken };
};

// Register handler
export const register = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        // Check if user already exists
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create the new user
        const newUser = await User.create({
            email,
            password: hashedPassword,
        });

        // Generate JWT tokens
        const { accessToken, refreshToken } = await generateAndStoreTokens(newUser);

        res.status(201).json({ accessToken, refreshToken });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Login handler
export const login = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    // Check if the user exists in the database
    const user = await findUserByEmail(email);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Compare the provided password with the hashed password stored in the database
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAndStoreTokens(user);

    // Send the tokens back in the response
    res.status(200).json({
        message: 'Login success',
        accessToken,
        refreshToken,
    });
};

// Refresh token handler
export const refresh = async (req: Request, res: Response): Promise<any> => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token is required' });
        }

        // Verify the refresh token
        let decodedToken;
        try {
            decodedToken = verifyRefreshToken(refreshToken);
        } catch (err) {
            return res.status(403).json({ error: 'Invalid refresh token' });
        }

        const { id, email } = decodedToken as { id: number, email: string };

        // Check if the refresh token exists in Redis
        const storedToken = await redisClient.get(`refresh:${id}`);

        if (!storedToken || storedToken !== refreshToken) {
            return res.status(403).json({ error: 'Invalid or expired refresh token' });
        }

        // Generate a new access token
        const accessToken = generateAccessToken({ id, email });

        res.status(200).json({ accessToken });
    } catch (error) {
        console.error('Error during refresh token:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Logout handler
export const logout = async (req: Request, res: Response): Promise<any> => {
    try {
        // @ts-ignore
        const { user } = req; // Access the user property after the middleware sets it

        if (!user) {
            return res.status(400).json({ error: 'No user to log out' });
        }

        // Remove the refresh token from Redis using the correct key
        await redisClient.del(`refresh:${user.id.toString()}`);

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
