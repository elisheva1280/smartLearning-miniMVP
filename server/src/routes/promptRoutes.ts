import { Router } from 'express';
import { getAllPrompts, getPromptById, getPromptsByUser, getPromptsByCategory, createPrompt, updatePrompt, deletePrompt } from '../controllers/promptController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getAllPrompts);
router.get('/:id', authenticateToken, getPromptById);
router.get('/user/:userId', authenticateToken, getPromptsByUser);
router.get('/category/:categoryId', authenticateToken, getPromptsByCategory);
router.post('/', authenticateToken, createPrompt);
router.put('/:id', authenticateToken, updatePrompt);
router.delete('/:id', authenticateToken, requireAdmin, deletePrompt);

export default router;
