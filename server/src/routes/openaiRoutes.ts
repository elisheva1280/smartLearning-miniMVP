import { Router } from 'express';
import { generateResponse } from '../controllers/openaiController';
import { validatePrompt, promptRateLimit } from '../middleware/validators';

const router = Router();

router.post('/', promptRateLimit, validatePrompt, generateResponse);

export default router;
