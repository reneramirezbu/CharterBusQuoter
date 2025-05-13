import { Request, Response } from 'express';
import { storage } from '../storage';
import { calculateQuote } from '../services/pricingService';
import { QuoteRequest, QuoteResponse } from '@shared/schema';
import { v4 as uuidv4 } from 'uuid';

/**
 * Calculate and generate a quote
 * 
 * This controller validates the incoming request, calculates a quote using the pricing
 * service, and returns the complete quote response to the client.
 */
export const generateQuote = async (req: Request, res: Response) => {
  try {
    const quoteRequest = req.body as QuoteRequest;
    
    // Additional validation beyond schema checks
    if (!quoteRequest.pickupLocation?.placeId || !quoteRequest.dropoffLocation?.placeId) {
      return res.status(400).json({ 
        message: 'Invalid location data',
        details: 'Both pickup and dropoff locations must have valid Google Place IDs'
      });
    }
    
    // Calculate the quote using the pricing service
    const quoteResponse = calculateQuote(quoteRequest);
    
    // Save the quote in storage for later retrieval
    await storage.saveQuote(quoteResponse);
    
    // Return the successful quote to the client
    res.status(200).json(quoteResponse);
  } catch (error: any) {
    console.error('Error generating quote:', error);
    
    // Determine the appropriate status code based on the error
    const statusCode = error.type === 'validation' ? 400 : 500;
    
    res.status(statusCode).json({ 
      message: 'Error generating quote', 
      error: error.message 
    });
  }
};

/**
 * Get a quote by ID
 * 
 * This controller retrieves a previously generated quote by its unique ID,
 * verifies that it hasn't expired, and returns it to the client.
 */
export const getQuoteById = async (req: Request, res: Response) => {
  try {
    const { quoteId } = req.params;
    
    if (!quoteId || typeof quoteId !== 'string' || quoteId.trim() === '') {
      return res.status(400).json({ message: 'Invalid quote ID' });
    }
    
    // Retrieve the quote from storage
    const quote = await storage.getQuote(quoteId);
    
    if (!quote) {
      return res.status(404).json({ 
        message: 'Quote not found',
        details: 'The requested quote could not be found or may have been deleted'
      });
    }
    
    // Check if quote has expired
    const expiryDate = new Date(quote.expiresAt);
    if (expiryDate < new Date()) {
      return res.status(410).json({ 
        message: 'Quote has expired',
        expiredAt: expiryDate,
        details: 'Quotes are valid for 24 hours after generation'
      });
    }
    
    // Return the valid quote
    res.status(200).json(quote);
  } catch (error: any) {
    console.error('Error retrieving quote:', error);
    res.status(500).json({ 
      message: 'Error retrieving quote', 
      error: error.message 
    });
  }
};
