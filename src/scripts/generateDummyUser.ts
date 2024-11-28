import bcrypt from 'bcrypt';
import { User } from '../models/user.model';

async function generateDummyUser() {
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    try {
        const hashedPassword = await bcrypt.hash('password123', 10);  // Hash password once

        const users = await Promise.all([
            User.create({
                email: 'user2monthOlder@usr.com',
                password: hashedPassword,  // Store the hashed password
                createdAt: twoMonthsAgo,
            }),
            User.create({
                email: 'user3monthOlder@usr.com',
                password: hashedPassword,  // Store the hashed password
                createdAt: threeMonthsAgo,
            }),
        ]);

        console.log('Dummy users created:', users);
    } catch (error) {
        console.error('Error creating dummy users:', error);
    }
}

generateDummyUser();
