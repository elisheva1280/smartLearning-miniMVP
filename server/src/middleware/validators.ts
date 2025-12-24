import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import DOMPurify from 'isomorphic-dompurify';

// Validation middleware for prompt
export const validatePrompt = [
  body('prompt')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Prompt must be between 1 and 1000 characters')
    .trim()
    .customSanitizer((value) => DOMPurify.sanitize(value)),
  body('category').optional().isString().withMessage('Category must be a string'),
  body('subcategory').optional().isString().withMessage('Subcategory must be a string'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validation middleware for user registration
export const validateRegister = [
  body('name')
    .isLength({ min: 2 })
    .withMessage('השם חייב להכיל לפחות 2 תווים')
    .trim()
    .customSanitizer((value) => DOMPurify.sanitize(value)),
  body('phone')
    .isLength({ min: 9, max: 15 })
    .withMessage('מספר טלפון חייב להכיל בין 9 ל-15 ספרות')
    .trim()
    .customSanitizer((value) => DOMPurify.sanitize(value)),
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('הסיסמה חייבת להיות בין 8 ל-16 תווים')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)
    .withMessage('הסיסמה חייבת להכיל אות גדולה, אות קטנה, מספר ותו מיוחד'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validation middleware for user login
export const validateLogin = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .trim()
    .customSanitizer((value) => DOMPurify.sanitize(value)),
  body('phone')
    .notEmpty()
    .withMessage('Phone is required')
    .trim()
    .customSanitizer((value) => DOMPurify.sanitize(value)),
  body('password').notEmpty().withMessage('Password is required'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Rate limiting for prompt creation
export const promptRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: { error: 'Too many prompts created, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for auth routes (login/register)
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { error: 'Too many attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// General rate limit
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
});

