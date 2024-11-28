import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

export const generateAccessToken = (user: { id: number; email: string }) => {
    return jwt.sign(user, ACCESS_TOKEN_SECRET as string, { expiresIn: '1h' }); // Access token valid for 1 hour
};

export const generateRefreshToken = (user: { id: number }) => {
    return jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET as string, { expiresIn: '7d' }); // Refresh token valid for 7 days
};

export const verifyAccessToken = (token: string) => {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET as string);
    } catch (error) {
        return null;
    }
};
