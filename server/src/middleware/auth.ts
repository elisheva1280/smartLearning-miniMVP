import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../types/User';
import logger from '../utils/logger';

interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    logger.warn('Auth failed: No token provided', { path: req.path });
    return res.status(401).json({ error: 'נדרש טוקן גישה' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err: any, user: any) => {
    if (err) {
      logger.warn('Auth failed: Invalid token', { path: req.path, error: err.message });
      return res.status(403).json({ error: 'טוקן לא תקין' });
    }
    req.user = user;
    next();
  });
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) {
    logger.warn('Access denied: Admin permissions required', { userId: req.user?.id, path: req.path });
    return res.status(403).json({ error: 'נדרשות הרשאות מנהל' });
  }
  next();
};
