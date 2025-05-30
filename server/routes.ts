import express, { type Express, NextFunction, Request, Response } from "express";
import { createServer, type Server } from "http";
import cors from "cors";
import { fileURLToPath } from 'url';
import { dirname, join } from "path";
import { generateQuote, getQuoteById } from "./controllers/quoteController";
import { getGoogleMapsApiKey } from "./controllers/googleMapsController";

// Fix for ESM modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Configure CORS for the API
 * 
 * This middleware enables cross-origin requests for the API and 
 * can be configured to allow specific domains.
 */
function configureCors(req: Request, res: Response, next: NextFunction) {
  // Get allowed origins from environment variable or use a fallback
  const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:3000', 'https://your-wordpress-domain.com'];
  
  // Check if the request origin is allowed
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // If no origin header or origin not in allowed list, allow all origins (for testing)
    // In production, you might want to restrict this
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  // Allow common HTTP methods
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
  // Allow common headers
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
  
  // Allow credentials
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  // Continue to the next middleware
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure CORS
  app.use(configureCors);
  
  // Define static files directory
  const publicPath = join(__dirname, '../public');
  
  // Route to serve the widget HTML
  app.get('/quote', (req, res) => {
    res.sendFile(join(publicPath, 'quote'));
  });
  
  // Configure static files with cache-control settings
  app.use('/static', express.static(publicPath, {
    maxAge: 0, // Disable caching during development
    etag: false, // Disable etag
    lastModified: false // Disable last-modified
  }));
  
  // Serve any static files from the public directory with no-cache headers
  app.get('/quote-widget.js', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(join(publicPath, 'quote-widget.js'));
  });
  
  app.get('/quote-widget.css', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(join(publicPath, 'quote-widget.css'));
  });
  
  app.get('/widget-styles.css', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(join(publicPath, 'widget-styles.css'));
  });
  
  app.get('/quote-widget-init.js', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(join(publicPath, 'quote-widget-init.js'));
  });
  
  app.get('/embed.js', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(join(publicPath, 'embed.js'));
  });
  
  app.get('/elementor', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(join(publicPath, 'elementor-embed.html'));
  });
  
  // Quote API routes
  app.post('/api/quotes', generateQuote);
  app.get('/api/quotes/:quoteId', getQuoteById);
  
  // Google Maps API key endpoint
  app.get('/api/google-maps-key', getGoogleMapsApiKey);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'API is running' });
  });

  // Create and return HTTP server
  const httpServer = createServer(app);
  return httpServer;
}