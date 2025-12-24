import { Request, Response } from 'express';
import { SubCategory, Category } from '../models';
import logger from '../utils/logger';

export const getAllSubCategories = async (req: Request, res: Response) => {
    try {
        const subCategories = await SubCategory.find().populate('category_id');
        logger.info('Returning all subcategories', { count: subCategories.length });
        res.json(subCategories);
    } catch (error: any) {
        logger.error('Error getting subcategories', { error: error.message });
        res.status(500).json({ error: 'שגיאה בקבלת תת-קטגוריות' });
    }
};

export const getSubCategoryById = async (req: Request, res: Response) => {
    try {
        const subCategory = await SubCategory.findById(req.params.id).populate('category_id');
        if (!subCategory) {
            logger.warn('Subcategory not found', { id: req.params.id });
            return res.status(404).json({ error: 'תת-קטגוריה לא נמצאה' });
        }
        res.json(subCategory);
    } catch (error: any) {
        logger.error('Error getting subcategory by id', { id: req.params.id, error: error.message });
        res.status(500).json({ error: 'שגיאה בקבלת תת-קטגוריה' });
    }
};

export const getSubCategoriesByCategory = async (req: Request, res: Response) => {
    try {
        const category = await Category.findOne({ name: req.params.categoryId });
        if (!category) {
            logger.warn('Category not found for subcategories', { categoryName: req.params.categoryId });
            return res.status(404).json({ error: 'קטגוריה לא נמצאה' });
        }
        const subCategories = await SubCategory.find({ category_id: category._id });
        logger.info('Returning subcategories for category', { categoryId: category._id, count: subCategories.length });
        res.json(subCategories);
    } catch (error: any) {
        logger.error('Error getting subcategories by category', { categoryId: req.params.categoryId, error: error.message });
        res.status(500).json({ error: 'שגיאה בקבלת תת-קטגוריות לפי קטגוריה' });
    }
};

export const createSubCategory = async (req: Request, res: Response) => {
    try {
        const { name, category_id } = req.body;
        const subCategory = new SubCategory({ name, category_id });
        await subCategory.save();
        logger.info('Subcategory created', { id: subCategory._id, name, categoryId: category_id });
        res.status(201).json(subCategory);
    } catch (error: any) {
        logger.error('Error creating subcategory', { error: error.message });
        res.status(500).json({ error: 'שגיאה ביצירת תת-קטגוריה' });
    }
};

export const updateSubCategory = async (req: Request, res: Response) => {
    try {
        const subCategory = await SubCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!subCategory) {
            logger.warn('Update failed: Subcategory not found', { id: req.params.id });
            return res.status(404).json({ error: 'תת-קטגוריה לא נמצאה' });
        }
        logger.info('Subcategory updated', { id: subCategory._id });
        res.json(subCategory);
    } catch (error: any) {
        logger.error('Error updating subcategory', { id: req.params.id, error: error.message });
        res.status(500).json({ error: 'שגיאה בעדכון תת-קטגוריה' });
    }
};

export const deleteSubCategory = async (req: Request, res: Response) => {
    try {
        const subCategory = await SubCategory.findByIdAndDelete(req.params.id);
        if (!subCategory) {
            logger.warn('Delete failed: Subcategory not found', { id: req.params.id });
            return res.status(404).json({ error: 'תת-קטגוריה לא נמצאה' });
        }
        logger.info('Subcategory deleted', { id: req.params.id });
        res.json({ message: 'תת-קטגוריה נמחקה בהצלחה' });
    } catch (error: any) {
        logger.error('Error deleting subcategory', { id: req.params.id, error: error.message });
        res.status(500).json({ error: 'שגיאה במחיקת תת-קטגוריה' });
    }
};
