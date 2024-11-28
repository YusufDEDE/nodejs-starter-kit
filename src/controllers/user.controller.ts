import { Request, Response } from 'express';
import { User } from '../models/user.model';  // Import your User model
import { Op } from 'sequelize';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        // Get the current date and subtract 2 months
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2); // Subtract 2 months from the current date

        // Fetch users who have registered in the last 2 days
        const users = await User.findAll({
            where: {
                createdAt: {
                    [Op.gte]: twoMonthsAgo,  // Greater than or equal to 2 months ago
                },
            },
        });

        // Send response with the users
        res.status(200).json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const allUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.findAll();
        // Send response with the users
        res.status(200).json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};