import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req as { method: string };
    
    // check jwt token
    // if (method === 'GET') {
        
    // }

    res.status(401).json({ message: 'Not authorized' });
}