import { Router } from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, checkUser, register, login, createAdmin } from '../controllers/userController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { validateRegister, validateLogin, authRateLimit } from '../middleware/validators';

const router = Router();

// Public routes
router.post('/register', authRateLimit, validateRegister, register);
router.post('/login', authRateLimit, validateLogin, login);
router.post('/check', authRateLimit, checkUser);

// Protected routes
router.get('/', authenticateToken, requireAdmin, getAllUsers);
router.get('/:id', authenticateToken, getUserById);
router.post('/', authenticateToken, requireAdmin, createUser);
router.post('/create-admin', authenticateToken, requireAdmin, createAdmin);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, requireAdmin, deleteUser);

export default router;