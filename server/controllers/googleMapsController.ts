import { Request, Response } from 'express';

/**
 * Controller to provide the Google Maps API key to the client
 * This helps secure the API key by not exposing it directly in the HTML
 */
export const getGoogleMapsApiKey = (req: Request, res: Response) => {
  try {
    const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'Google Maps API key is not configured.'
      });
    }
    
    return res.status(200).json({
      success: true,
      apiKey
    });
  } catch (error) {
    console.error('Error retrieving Google Maps API key:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving the Google Maps API key.'
    });
  }
};