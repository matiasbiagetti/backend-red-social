import { Request, Response } from 'express';
import axios from 'axios';

export const getAds = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await axios.get('https://api.example.com/ads');
        res.status(200).json(response.data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
