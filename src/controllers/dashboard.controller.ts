import { Request, Response } from 'express';



export const dashboard = async (req: Request, res: Response): Promise<void> => {
    try {
        res.status(200).json({"message": "Welcome Dashboard! - I see your token!"});
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};