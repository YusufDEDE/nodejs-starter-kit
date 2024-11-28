import {Request, Response, NextFunction} from 'express';
import {verifyAccessToken} from '../utils/jwt.utils';
import getRedisClient from "../config/redis";

const redisClient = getRedisClient();

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(403).json({error: 'No token provided'});
    }

    const token = authHeader.split(' ')[1]; // Extract token from Bearer <token>
    if (!token) {
        return res.status(403).json({error: 'Invalid token format'});
    }

    // Verify the access token
    let decoded;
    try {
        decoded = verifyAccessToken(token);
    } catch (err) {
        return res.status(401).json({error: 'Invalid or expired token'});
    }

    // @ts-ignore
    const {id} = decoded;

    // Check if the refresh token is needed for validation (e.g., in some cases, checking if the user is logged in)
    if (decoded && id) {
        // Check if the refresh token is in Redis (you can modify this logic based on your needs)
        const storedToken = await redisClient.get(`refresh:${id}`);

        if (!storedToken) {
            return res.status(403).json({error: 'No valid refresh token in Redis'});
        }
    }

    // If everything is fine, attach the decoded user to the request object
    // @ts-ignore
    req.user = decoded;

    next(); // Continue to the next middleware or route handler
};
