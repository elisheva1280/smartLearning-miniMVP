import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import axios from 'axios';
import { Request, Response } from 'express';

// Mocks must be at the top level
jest.mock('axios');
jest.mock('isomorphic-dompurify', () => ({
  sanitize: (val: string) => val
}));
jest.mock('../utils/logger');

// Mock express-validator before importing middleware
const mockValidationResult = jest.fn() as any;
jest.mock('express-validator', () => {
  const actual = jest.requireActual('express-validator') as any;
  return {
    ...actual,
    validationResult: (req: any) => mockValidationResult(req)
  };
});

import { generateResponse } from '../controllers/openaiController';
import { validatePrompt } from '../middleware/validators';

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AI Service & Validation', () => {
  let mockRequest: any;
  let mockResponse: any;

  beforeEach(() => {
    mockRequest = {
      body: {},
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('generateResponse Controller', () => {
    test('should return 200 and AI response for a valid prompt', async () => {
      const mockAiContent = 'This is a test response from AI';
      mockRequest.body = {
        prompt: 'Test prompt',
        category: 'Math',
        subcategory: 'Algebra',
      };

      mockedAxios.post.mockResolvedValueOnce({
        data: {
          choices: [{ message: { content: mockAiContent } }],
        },
      });

      await generateResponse(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith({ response: mockAiContent });
    });

    test('should return 503 if OpenAI API fails', async () => {
      mockRequest.body = { prompt: 'Test' };
      mockedAxios.post.mockRejectedValueOnce({
        response: { status: 429, data: 'Rate limit exceeded' },
      });

      await generateResponse(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(503);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({ isAIError: true })
      );
    });
  });

  describe('validatePrompt Middleware', () => {
    test('last middleware should return 400 if there are validation errors', async () => {
      const lastMiddleware = validatePrompt[validatePrompt.length - 1];
      
      mockValidationResult.mockReturnValueOnce({
        isEmpty: () => false,
        array: () => [{ msg: 'Prompt must be between 1 and 1000 characters' }]
      });

      await lastMiddleware(mockRequest, mockResponse, () => {});

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          errors: expect.arrayContaining([
            expect.objectContaining({ msg: 'Prompt must be between 1 and 1000 characters' })
          ])
        })
      );
    });

    test('last middleware should call next() if there are no errors', async () => {
      const lastMiddleware = validatePrompt[validatePrompt.length - 1];
      const next = jest.fn();
      
      mockValidationResult.mockReturnValueOnce({
        isEmpty: () => true,
        array: () => []
      });

      await lastMiddleware(mockRequest, mockResponse, next);

      expect(next).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
  });
});
