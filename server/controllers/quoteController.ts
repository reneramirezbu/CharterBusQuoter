import { Request, Response } from 'express';
import { calculateQuote } from '../services/pricingService';
import { quoteRequestSchema, QuoteRequest } from '../../shared/schema';
import { storage } from '../storage';
import { ZodError } from 'zod';

/**
 * Calculate and generate a quote
 * 
 * This controller validates the incoming request, calculates a quote using the pricing
 * service, and returns the complete quote response to the client.
 */
export const generateQuote = async (req: Request, res: Response) => {
  try {
    // Validate request body against schema
    const quoteRequest = quoteRequestSchema.parse(req.body) as QuoteRequest;

    // Additional validation
    const validationErrors = validateQuoteRequest(quoteRequest);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: validationErrors
      });
    }

    // Calculate quote
    const quoteResponse = await calculateQuote(quoteRequest);
    
    // Save quote to storage
    await storage.saveQuote(quoteResponse);
    
    // Return the quote response
    return res.status(200).json(quoteResponse);
  } catch (error) {
    console.error('Error generating quote:', error);
    
    // Handle ZodError (validation error)
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    }
    
    // Handle other errors
    return res.status(500).json({
      success: false,
      message: 'An error occurred while generating your quote.'
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
    
    if (!quoteId) {
      return res.status(400).json({
        success: false,
        message: 'Quote ID is required'
      });
    }
    
    // Retrieve quote from storage
    const quote = await storage.getQuote(quoteId);
    
    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
    }
    
    // Check if quote has expired
    const expirationDate = new Date(quote.expiresAt);
    if (expirationDate < new Date()) {
      return res.status(410).json({
        success: false,
        message: 'Quote has expired'
      });
    }
    
    // Return the quote
    return res.status(200).json(quote);
  } catch (error) {
    console.error('Error retrieving quote:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving the quote.'
    });
  }
};

/**
 * Additional validation for quote requests
 * 
 * This function performs additional validation on the quote request beyond
 * what the Zod schema can validate.
 */
function validateQuoteRequest(quoteRequest: QuoteRequest): Array<{field: string, message: string}> {
  const errors: Array<{field: string, message: string}> = [];
  
  // Validate dates
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  const departureDate = new Date(quoteRequest.departureDate);
  departureDate.setHours(0, 0, 0, 0);
  
  if (departureDate < currentDate) {
    errors.push({
      field: 'departureDate',
      message: 'Departure date cannot be in the past'
    });
  }
  
  // Validate return date for round trips
  if (quoteRequest.tripType === 'roundTrip' && quoteRequest.returnDate) {
    const returnDate = new Date(quoteRequest.returnDate);
    returnDate.setHours(0, 0, 0, 0);
    
    if (returnDate < departureDate) {
      errors.push({
        field: 'returnDate',
        message: 'Return date must be after departure date'
      });
    }
  }
  
  // Validate passenger count
  if (quoteRequest.numPassengers < 1) {
    errors.push({
      field: 'numPassengers',
      message: 'Number of passengers must be at least 1'
    });
  }
  
  if (quoteRequest.numPassengers > 100) {
    errors.push({
      field: 'numPassengers',
      message: 'Number of passengers cannot exceed 100'
    });
  }
  
  // Validate locations
  if (!quoteRequest.pickupLocation.placeId) {
    errors.push({
      field: 'pickupLocation',
      message: 'Valid pickup location is required'
    });
  }
  
  if (!quoteRequest.dropoffLocation.placeId) {
    errors.push({
      field: 'dropoffLocation',
      message: 'Valid dropoff location is required'
    });
  }
  
  // Validate pickup and dropoff are not the same
  if (
    quoteRequest.pickupLocation.placeId &&
    quoteRequest.dropoffLocation.placeId &&
    quoteRequest.pickupLocation.placeId === quoteRequest.dropoffLocation.placeId
  ) {
    errors.push({
      field: 'dropoffLocation',
      message: 'Pickup and dropoff locations cannot be the same'
    });
  }
  
  return errors;
}