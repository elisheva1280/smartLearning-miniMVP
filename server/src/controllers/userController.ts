import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import logger from '../utils/logger';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        logger.info('Returning all users', { count: users.length });
        res.json(users);
    } catch (error: any) {
        logger.error('Error getting users', { error: error.message });
        res.status(500).json({ error: 'שגיאה בקבלת משתמשים' });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            logger.warn('User not found', { id: req.params.id });
            return res.status(404).json({ error: 'משתמש לא נמצא' });
        }
        res.json(user);
    } catch (error: any) {
        logger.error('Error getting user by id', { id: req.params.id, error: error.message });
        res.status(500).json({ error: 'שגיאה בקבלת משתמש' });
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const { name, phone, password } = req.body;
        
        const existingUser = await User.findOne({ name, phone });
        if (existingUser) {
            logger.warn('Registration failed: User already exists', { name, phone });
            return res.status(400).json({ error: 'משתמש עם שם וטלפון זה כבר קיים' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, username: name, phone, password: hashedPassword });
        await user.save();
        
        logger.info('User registered successfully', { userId: user._id, name });

        const token = jwt.sign(
            { id: user._id, name: user.name, phone: user.phone, isAdmin: user.isAdmin },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: '24h' }
        );
        
        res.status(201).json({ 
            token, 
            user: { id: user._id, name: user.name, phone: user.phone, isAdmin: user.isAdmin } 
        });
    } catch (error: any) {
        logger.error('Register error', { error: error.message });
        res.status(500).json({ error: 'שגיאה ברישום משתמש' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { name, phone, password } = req.body;
        
        const user = await User.findOne({ name, phone });
        
        if (!user) {
            logger.warn('Login failed: User not found', { name, phone });
            return res.status(400).json({ error: 'שם משתמש, טלפון או סיסמה שגויים' });
        }
        
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            logger.warn('Login failed: Invalid password', { userId: user._id });
            return res.status(400).json({ error: 'שם משתמש, טלפון או סיסמה שגויים' });
        }
        
        logger.info('User logged in successfully', { userId: user._id });

        const token = jwt.sign(
            { id: user._id, name: user.name, phone: user.phone, isAdmin: user.isAdmin },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: '24h' }
        );
        
        res.json({ 
            token, 
            user: { id: user._id, name: user.name, phone: user.phone, isAdmin: user.isAdmin } 
        });
    } catch (error: any) {
        logger.error('Login error', { error: error.message });
        res.status(500).json({ error: 'שגיאה בהתחברות' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, phone, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, phone, password: hashedPassword });
        await user.save();
        logger.info('User created by admin', { userId: user._id });
        res.status(201).json(user);
    } catch (error: any) {
        logger.error('Error creating user', { error: error.message });
        res.status(500).json({ error: 'שגיאה ביצירת משתמש' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            logger.warn('Update failed: User not found', { id: req.params.id });
            return res.status(404).json({ error: 'משתמש לא נמצא' });
        }
        logger.info('User updated', { userId: user._id });
        res.json(user);
    } catch (error: any) {
        logger.error('Error updating user', { id: req.params.id, error: error.message });
        res.status(500).json({ error: 'שגיאה בעדכון משתמש' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            logger.warn('Delete failed: User not found', { id: req.params.id });
            return res.status(404).json({ error: 'משתמש לא נמצא' });
        }
        logger.info('User deleted', { userId: req.params.id });
        res.json({ message: 'משתמש נמחק בהצלחה' });
    } catch (error: any) {
        logger.error('Error deleting user', { id: req.params.id, error: error.message });
        res.status(500).json({ error: 'שגיאה במחיקת משתמש' });
    }
};

export const createAdmin = async (req: Request, res: Response) => {
    try {
        const { name, phone, password } = req.body;
        
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            const hashedPassword = await bcrypt.hash(password, 10);
            existingUser.password = hashedPassword;
            existingUser.isAdmin = true;
            await existingUser.save();
            logger.info('User promoted to admin', { userId: existingUser._id });
            res.json({ message: 'משתמש עודכן למנהל', user: existingUser });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const admin = new User({ name, phone, password: hashedPassword, isAdmin: true });
            await admin.save();
            logger.info('New admin created', { userId: admin._id });
            res.status(201).json({ message: 'מנהל נוצר בהצלחה', user: admin });
        }
    } catch (error: any) {
        logger.error('Error creating admin', { error: error.message });
        res.status(500).json({ error: 'שגיאה ביצירת מנהל' });
    }
};

export const checkUser = async (req: Request, res: Response) => {
    try {
        const { name, phone } = req.body;
        const user = await User.findOne({ name, phone });
        
        if (user) {
            logger.info('User check: exists', { userId: user._id });
            res.json({ 
                exists: true, 
                isAdmin: user.isAdmin || false,
                user: {
                    id: user._id,
                    name: user.name,
                    phone: user.phone
                }
            });
        } else {
            logger.info('User check: not found', { name, phone });
            res.json({ 
                exists: false,
                isAdmin: false
            });
        }
    } catch (error: any) {
        logger.error('Error checking user', { error: error.message });
        res.status(500).json({ error: 'שגיאה בבדיקת משתמש' });
    }
};
