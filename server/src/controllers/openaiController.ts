import { Request, Response } from 'express';
import axios from 'axios';
import logger from '../utils/logger';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const generateResponse = async (req: Request, res: Response) => {
    try {
        const { prompt, category, subcategory } = req.body;
        
        // יצירת פרומפט מורחב עם קונטקסט
        const contextualPrompt = `בתחום ${category || 'כללי'} ובנושא ${subcategory || 'כללי'}, ${prompt}`;

        logger.info('Generating AI response', { category, subcategory });

        // נסיון לשלוח ל-OpenAI
        try {
            const result = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "user",
                    content: contextualPrompt
                }],
                max_tokens: 1200,
                temperature: 0.7
            }, {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            res.json({ response: result.data.choices[0].message.content });
        } catch (openaiError: any) {
            logger.error('OpenAI API Error', { 
                error: openaiError.response?.data || openaiError.message,
                status: openaiError.response?.status
            });
            
            // החזרת שגיאה מפורטת למשתמש
            let errorMessage = 'שירות ה-AI זמנית לא זמין';
            
            if (openaiError.response?.status === 401) {
                errorMessage = 'שגיאה באימות - מפתח API לא תקין';
            } else if (openaiError.response?.status === 429) {
                errorMessage = 'חרגנו ממכסת השימוש - נסה שוב מאוחר יותר';
            } else if (openaiError.code === 'ENOTFOUND' || openaiError.code === 'ECONNREFUSED') {
                errorMessage = 'אין חיבור לאינטרנט או שהשירות חסום';
            }
            
            return res.status(503).json({ 
                error: errorMessage,
                isAIError: true 
            });
        }
    } catch (error: any) {
        logger.error('General error in generateResponse', { error: error.message });
        res.status(500).json({ error: 'שגיאה כללית בשרת' });
    }
};
