import { Request, Response } from 'express';
import { Category } from '../models';
import logger from '../utils/logger';

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Category.find();
        logger.info('Returning all categories', { count: categories.length });
        res.json(categories);
    } catch (error: any) {
        logger.error('Error getting categories', { error: error.message });
        res.status(500).json({ error: 'שגיאה בקבלת קטגוריות' });
    }
};

export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            logger.warn('Category not found', { id: req.params.id });
            return res.status(404).json({ error: 'קטגוריה לא נמצאה' });
        }
        res.json(category);
    } catch (error: any) {
        logger.error('Error getting category by id', { id: req.params.id, error: error.message });
        res.status(500).json({ error: 'שגיאה בקבלת קטגוריה' });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const category = new Category({ name });
        await category.save();
        logger.info('Category created', { id: category._id, name });
        res.status(201).json(category);
    } catch (error: any) {
        logger.error('Error creating category', { error: error.message });
        res.status(500).json({ error: 'שגיאה ביצירת קטגוריה' });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!category) {
            logger.warn('Update failed: Category not found', { id: req.params.id });
            return res.status(404).json({ error: 'קטגוריה לא נמצאה' });
        }
        logger.info('Category updated', { id: category._id });
        res.json(category);
    } catch (error: any) {
        logger.error('Error updating category', { id: req.params.id, error: error.message });
        res.status(500).json({ error: 'שגיאה בעדכון קטגוריה' });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            logger.warn('Delete failed: Category not found', { id: req.params.id });
            return res.status(404).json({ error: 'קטגוריה לא נמצאה' });
        }
        logger.info('Category deleted', { id: req.params.id });
        res.json({ message: 'קטגוריה נמחקה בהצלחה' });
    } catch (error: any) {
        logger.error('Error deleting category', { id: req.params.id, error: error.message });
        res.status(500).json({ error: 'שגיאה במחיקת קטגוריה' });
    }
};
