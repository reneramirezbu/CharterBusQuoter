import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  generateQuote,
  getQuoteById
} from "./controllers/quoteController";
import { validateQuoteRequest } from "./utils/validation";

export async function registerRoutes(app: Express): Promise<Server> {
  // Quote routes
  app.post('/api/quotes', validateQuoteRequest, generateQuote);
  app.get('/api/quotes/:quoteId', getQuoteById);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'API is running' });
  });

  const httpServer = createServer(app);

  return httpServer;
}
