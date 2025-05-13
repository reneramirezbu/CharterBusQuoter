import { Request, Response } from 'express';
import { storage } from '../storage';
import { calculateQuote } from '../services/pricingService';
import { QuoteRequest, QuoteResponse } from '@shared/schema';
import { v4 as uuidv4 } from 'uuid';

// Calculate and generate a quote
export const generateQuote = async (req: Request, res: Response) => {
  try {
    const quoteRequest = req.body as QuoteRequest;
    
    // Calculate the quote using the pricing service
    const quoteResponse = calculateQuote(quoteRequest);
    
    // Save the quote in storage
    await storage.saveQuote(quoteResponse);
    
    // Return the quote to the client
    res.status(200).json(quoteResponse);
  } catch (error: any) {
    console.error('Error generating quote:', error);
    res.status(500).json({ 
      message: 'Error generating quote', 
      error: error.message 
    });
  }
};

// Get a quote by ID
export const getQuoteById = async (req: Request, res: Response) => {
  try {
    const { quoteId } = req.params;
    
    // Retrieve the quote from storage
    const quote = await storage.getQuote(quoteId);
    
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }
    
    // Check if quote has expired
    const expiryDate = new Date(quote.expiresAt);
    if (expiryDate < new Date()) {
      return res.status(410).json({ 
        message: 'Quote has expired',
        expiredAt: expiryDate
      });
    }
    
    res.status(200).json(quote);
  } catch (error: any) {
    console.error('Error retrieving quote:', error);
    res.status(500).json({ 
      message: 'Error retrieving quote', 
      error: error.message 
    });
  }
};
