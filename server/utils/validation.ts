import { Request, Response, NextFunction } from 'express';
import { quoteRequestSchema } from '@shared/schema';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

// Middleware to validate quote requests
export const validateQuoteRequest = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = quoteRequestSchema.parse(req.body);
    req.body = validatedData; // Replace with validated data
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      res.status(400).json({ 
        message: 'Validation error', 
        errors: validationError.details,
        error: validationError.message
      });
    } else {
      res.status(400).json({ 
        message: 'Invalid request data',
        error: (error as Error).message
      });
    }
  }
};

// Additional validation functions can be added here
