import jwt from 'jsonwebtoken';

const accessSecret = process.env.JWT_SECRET || 'access_secret';
const refreshSecret = process.env.JWT_REFRESH_SECRET || 'refresh_secret';

export const generateAccessToken = (payload: object): string => {
    return jwt.sign(payload, accessSecret, { expiresIn: '15m' });
};

export const generateRefreshToken = (payload: object): string => {
    return jwt.sign(payload, refreshSecret, { expiresIn: '7d' });
};

export const verifyToken = (token: string, type: 'access' | 'refresh') => {
    const secret = type === 'access' ? accessSecret : refreshSecret;
    return jwt.verify(token, secret);
};