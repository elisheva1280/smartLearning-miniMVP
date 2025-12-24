import { Request, Response } from 'express';
import { Prompt } from '../models';
import logger from '../utils/logger';

export const getAllPrompts = async (req: any, res: Response) => {
    try {
        const user = req.user;
        let query = {};
        
        if (!user.isAdmin) {
            query = { user_id: user.id };
        }

        const prompts = await Prompt.find(query)
            .populate('user_id')
            .populate('category_id')
            .populate('sub_category_id');
        
        logger.info('Returning prompts', { 
            count: prompts.length, 
            userId: user.id, 
            isAdmin: user.isAdmin 
        });
        res.json(prompts);
    } catch (error: any) {
        logger.error('Error getting prompts', { error: error.message });
        res.status(500).json({ error: 'שגיאה בקבלת פרומפטים' });
    }
};

export const getPromptById = async (req: Request, res: Response) => {
    try {
        const prompt = await Prompt.findById(req.params.id)
            .populate('user_id')
            .populate('category_id')
            .populate('sub_category_id');
        if (!prompt) {
            logger.warn('Prompt not found', { id: req.params.id });
            return res.status(404).json({ error: 'פרומפט לא נמצא' });
        }
        res.json(prompt);
    } catch (error: any) {
        logger.error('Error getting prompt by id', { id: req.params.id, error: error.message });
        res.status(500).json({ error: 'שגיאה בקבלת פרומפט' });
    }
};

export const getPromptsByUser = async (req: Request, res: Response) => {
    try {
        const prompts = await Prompt.find({ user_id: req.params.userId })
            .populate('category_id')
            .populate('sub_category_id');
        logger.info('Returning prompts for user', { userId: req.params.userId, count: prompts.length });
        res.json(prompts);
    } catch (error: any) {
        logger.error('Error getting prompts by user', { userId: req.params.userId, error: error.message });
        res.status(500).json({ error: 'שגיאה בקבלת פרומפטים לפי משתמש' });
    }
};

export const getPromptsByCategory = async (req: Request, res: Response) => {
    try {
        const prompts = await Prompt.find({ category_id: req.params.categoryId })
            .populate('user_id')
            .populate('sub_category_id');
        logger.info('Returning prompts for category', { categoryId: req.params.categoryId, count: prompts.length });
        res.json(prompts);
    } catch (error: any) {
        logger.error('Error getting prompts by category', { categoryId: req.params.categoryId, error: error.message });
        res.status(500).json({ error: 'שגיאה בקבלת פרומפטים לפי קטגוריה' });
    }
};

export const createPrompt = async (req: Request, res: Response) => {
    try {
        const { user_id, category_id, sub_category_id, category, subcategory, prompt, response } = req.body;
        const newPrompt = new Prompt({ user_id, category_id, sub_category_id, category, subcategory, prompt, response });
        await newPrompt.save();
        logger.info('Prompt created successfully', { id: newPrompt._id, userId: user_id });
        res.status(201).json(newPrompt);
    } catch (error: any) {
        logger.error('Error creating prompt', { error: error.message });
        res.status(500).json({ error: 'שגיאה ביצירת פרומפט' });
    }
};

export const updatePrompt = async (req: Request, res: Response) => {
    try {
        const prompt = await Prompt.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!prompt) {
            logger.warn('Update failed: Prompt not found', { id: req.params.id });
            return res.status(404).json({ error: 'פרומפט לא נמצא' });
        }
        logger.info('Prompt updated', { id: prompt._id });
        res.json(prompt);
    } catch (error: any) {
        logger.error('Error updating prompt', { id: req.params.id, error: error.message });
        res.status(500).json({ error: 'שגיאה בעדכון פרומפט' });
    }
};

export const deletePrompt = async (req: Request, res: Response) => {
    try {
        const prompt = await Prompt.findByIdAndDelete(req.params.id);
        if (!prompt) {
            logger.warn('Delete failed: Prompt not found', { id: req.params.id });
            return res.status(404).json({ error: 'פרומפט לא נמצא' });
        }
        logger.info('Prompt deleted', { id: req.params.id });
        res.json({ message: 'פרומפט נמחק בהצלחה' });
    } catch (error: any) {
        logger.error('Error deleting prompt', { id: req.params.id, error: error.message });
        res.status(500).json({ error: 'שגיאה במחיקת פרומפט' });
    }
};
