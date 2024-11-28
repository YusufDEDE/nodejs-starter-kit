import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.utils';

export const verifyToken = (req: Request, res: Response, next: NextFunction): any => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(403).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract token from Bearer <token>

    if (!token) {
        return res.status(403).json({ error: 'Invalid token format' });
    }

    // Verify the access token
    const decoded = verifyAccessToken(token);

    if (!decoded) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Attach the decoded user info to the request object for future use

    // @ts-ignore
    req.user = decoded;
    next(); // Continue to the next middleware or route handler
};
