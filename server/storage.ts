import { 
  User, 
  InsertUser, 
  QuoteRequest, 
  QuoteResponse 
} from "@shared/schema";

// Modify the interface with any CRUD methods you might need
export interface IStorage {
  // User methods from original project
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Quote methods
  saveQuote(quoteResponse: QuoteResponse): Promise<QuoteResponse>;
  getQuote(quoteId: string): Promise<QuoteResponse | undefined>;
  getAllQuotes(): Promise<QuoteResponse[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private quotes: Map<string, QuoteResponse>;
  currentUserId: number;

  constructor() {
    this.users = new Map();
    this.quotes = new Map();
    this.currentUserId = 1;
  }

  // User methods from original project
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Quote methods
  async saveQuote(quoteResponse: QuoteResponse): Promise<QuoteResponse> {
    this.quotes.set(quoteResponse.quoteId, quoteResponse);
    return quoteResponse;
  }
  
  async getQuote(quoteId: string): Promise<QuoteResponse | undefined> {
    return this.quotes.get(quoteId);
  }
  
  async getAllQuotes(): Promise<QuoteResponse[]> {
    return Array.from(this.quotes.values());
  }
}

export const storage = new MemStorage();
