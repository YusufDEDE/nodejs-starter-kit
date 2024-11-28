import { Request, Response } from 'express';
import {verifyAccessToken} from "../utils/jwt.utils";



export const dashboard = async (req: Request, res: Response): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        // @ts-ignore
        const token = authHeader.split(' ')[1];
        const decode = verifyAccessToken(token);

        // @ts-ignore
        res.status(200).json({"message": "Welcome Dashboard! - I see your token!", "your_mail": decode.email});
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};