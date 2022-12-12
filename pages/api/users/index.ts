import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuid } from 'uuid';
// import fs from 'fs'; 
import { hash } from 'bcryptjs';
// import data from '../../../data/users.json';
import { User, UserResponse } from '../../../interfaces/User';
import prisma from '../../../utils/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // const users: UserResponse[] = JSON.parse(JSON.stringify(data));
    const { method } = req as { method: string };

    if(method === 'POST') {
        const { name, password, username, faceBase64 } = req.body as User;
        // const doesUserExist = users.find(user => user.username === username);
        const doesUserExist = await prisma.user.findUnique({
            where: {
                username
            }
        });

        if(doesUserExist) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const hashedPassword = await hash(password, 10);

        const newUser: UserResponse = {
            id: uuid(),
            name,
            username,
            faceBase64,
            password: hashedPassword
        };

        await prisma.user.create({
            data: newUser
        });

        return res.status(201).json({ message: 'User created successfully', user: newUser });
    }

    if(method === 'GET') {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                name: true,
                faceBase64: true,
                password: true
            }
        });
        return res.status(200).json({ users });
    }

    return res.status(404).json({ message: 'Not found' });
}