import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs'; 
import { hash } from 'bcryptjs';
import data from '../../../data/users.json';
import { User, UserResponse } from '../../../interfaces/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const users: UserResponse[] = JSON.parse(JSON.stringify(data));
    const { method } = req as { method: string };

    if(method === 'GET') {
        const { id } = req.query as { id: string };
        const user: Omit<UserResponse, 'password'> | undefined = users.find(user => user.id === id);

        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ user });
    }

    if(method === 'PUT') {
        const data = req.body as Partial<User>;
        const { id } = req.query as { id: string };

        const userIndex = users.findIndex(user => user.id === id);

        if(userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }

        if(data.username && data.username !== users[userIndex].username && users.find(user => user.username === data.username)) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        if(data.password) {
            data.password = await hash(data.password, 10);
        }

        users[userIndex] = {
            ...users[userIndex],
            ...data
        };

        fs.writeFileSync('data/users.json', JSON.stringify(users, null, 4));

        return res.status(200).json({ message: 'User updated successfully', user: users[userIndex] });
    }

    if(method === 'DELETE') {
        const { id } = req.query as { id: string };

        const userIndex = users.findIndex(user => user.id === id);

        if(userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }

        users.splice(userIndex, 1);

        fs.writeFileSync('data/users.json', JSON.stringify(users, null, 4));

        return res.status(200).json({ message: 'User deleted successfully' });
    }

    return res.status(404).json({ message: 'Not found' });
}