import { Router } from 'express';
import { getAllSubCategories, getSubCategoryById, getSubCategoriesByCategory, createSubCategory, updateSubCategory, deleteSubCategory } from '../controllers/subCategoryController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', getAllSubCategories);
router.get('/:id', getSubCategoryById);
router.get('/category/:categoryId', getSubCategoriesByCategory);
router.post('/', authenticateToken, requireAdmin, createSubCategory);
router.put('/:id', authenticateToken, requireAdmin, updateSubCategory);
router.delete('/:id', authenticateToken, requireAdmin, deleteSubCategory);

export default router;
