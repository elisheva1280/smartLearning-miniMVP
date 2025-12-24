import { Router } from 'express';
import { savePromptHistory, getUserHistory, clearUserHistory } from '../controllers/promptHistoryController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, savePromptHistory);
router.get('/:userId', authenticateToken, getUserHistory);
router.delete('/:userId', authenticateToken, clearUserHistory);

export default router;
