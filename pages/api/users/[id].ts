import type { NextApiRequest, NextApiResponse } from 'next';
// import fs from 'fs'; 
import { hash } from 'bcryptjs';
// import data from '../../../data/users.json';
import { User } from '../../../interfaces/User';
import prisma from '../../../utils/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // const users: UserResponse[] = JSON.parse(JSON.stringify(data));
    const { method } = req as { method: string };

    if(method === 'GET') {
        const { id } = req.query as { id: string };
        // const user: Omit<UserResponse, 'password'> | undefined = users.find(user => user.id === id);
        const user = await prisma.user.findFirst({
            where: {
                id
            },
            select: {
                id: true,
                username: true,
                name: true,
                faceBase64: true,
                password: false
            }
        });

        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ user });
    }

    if(method === 'PUT') {
        const reqData = req.body as Partial<User>;
        const { id } = req.query as { id: string };

        // const userIndex = users.findIndex(user => user.id === id);
        const user = await prisma.user.findFirst({
            where: {
                id
            }
        });

        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const usernameExists = await prisma.user.findFirst({
            where: {
                username: reqData.username
            }
        });

        if(reqData.username && reqData.username !== user.username && usernameExists) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        if(reqData.password) {
            reqData.password = await hash(reqData.password, 10);
        }

        // users[userIndex] = {
        //     ...users[userIndex],
        //     ...reqData
        // };

        const newUser = await prisma.user.update({
            where: {
                id
            },
            data: {
                ...reqData
            }
        });

        // fs.writeFileSync('data/users.json', JSON.stringify(users, null, 4));

        return res.status(200).json({ message: 'User updated successfully', user: newUser });
    }

    if(method === 'DELETE') {
        const { id } = req.query as { id: string };

        // const userIndex = users.findIndex(user => user.id === id);

        try {
            await prisma.user.delete({
                where: {
                    id
                }
            });

            return res.status(200).json({ message: 'User deleted successfully' });
        } catch (_error) {
            return res.status(404).json({ message: 'User not found' });
        }

        // if(userIndex === -1) {
        //     return res.status(404).json({ message: 'User not found' });
        // }

        // users.splice(userIndex, 1);

        // fs.writeFileSync('data/users.json', JSON.stringify(users, null, 4));

        // return res.status(200).json({ message: 'User deleted successfully' });
    }

    return res.status(404).json({ message: 'Not found' });
}