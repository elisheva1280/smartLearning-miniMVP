import { Request, Response } from 'express';
import { PromptHistory } from '../models';
import logger from '../utils/logger';

export const savePromptHistory = async (req: Request, res: Response) => {
    try {
        const { userId, category, subcategory, prompt, response } = req.body;
        
        const historyItem = new PromptHistory({
            userId,
            category,
            subcategory,
            prompt,
            response
        });
        
        await historyItem.save();
        logger.info('History saved successfully', { userId });
        res.status(201).json({ message: 'History saved successfully' });
    } catch (error: any) {
        logger.error('Error saving history', { error: error.message });
        res.status(500).json({ error: 'Failed to save history' });
    }
};

export const getUserHistory = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        
        const history = await PromptHistory.find({ userId })
            .sort({ timestamp: -1 })
            .limit(100);
            
        logger.info('Returning user history', { userId, count: history.length });
        res.json(history);
    } catch (error: any) {
        logger.error('Error fetching history', { userId: req.params.userId, error: error.message });
        res.status(500).json({ error: 'Failed to fetch history' });
    }
};

export const clearUserHistory = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        
        await PromptHistory.deleteMany({ userId });
        logger.info('History cleared successfully', { userId });
        res.json({ message: 'History cleared successfully' });
    } catch (error: any) {
        logger.error('Error clearing history', { userId: req.params.userId, error: error.message });
        res.status(500).json({ error: 'Failed to clear history' });
    }
};
