import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import data from '../../data/users.json';
import { UserResponse } from '../../interfaces/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req as { method: string };
    const users: UserResponse[] = JSON.parse(JSON.stringify(data));
    
    if(method === 'POST') {
        const { img, username } = req.body as { img: string, username: string };

        if(!img) {
            return res.status(404).json({ message: 'Image not found' });
        }

        if(!username) {
            return res.status(404).json({ message: 'Username not found' });
        }

        const user = users.find(user => user.username === username);

        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const response = await axios.post(process.env.PY_API as string, { img1: img, img2: user.faceBase64 });
        
        if (response.status !== 200) {
            return res.status(404).json({ message: 'Images could not be checked' });
        }

        const { result } = response.data as { result: boolean };

        return res.status(200).json({ result });
    }

    return res.status(404).json({ message: 'Not found' });
}