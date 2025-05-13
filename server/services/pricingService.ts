import { 
  QuoteRequest, 
  QuoteResponse,
  QuoteBreakdownItem
} from '@shared/schema';
import { v4 as uuidv4 } from 'uuid';

// This service is responsible for calculating quote prices
export function calculateQuote(tripDetails: QuoteRequest): QuoteResponse {
  const {
    numPassengers,
    busType,
    amenities = [],
    tripType
  } = tripDetails;

  const breakdown: QuoteBreakdownItem[] = [];
  
  // 1. Base Price based on Bus Type
  let basePrice = busType === 'luxury' ? 200 : 100;
  breakdown.push({
    name: `Base Price (${busType})`,
    description: `Starting price for selected bus type`,
    amount: basePrice
  });
  
  // 2. Passenger Count Adjustment
  let passengerPrice = 0;
  if (numPassengers > 50) passengerPrice = 150;
  else if (numPassengers > 30) passengerPrice = 100;
  else if (numPassengers > 15) passengerPrice = 50;
  
  breakdown.push({
    name: "Passenger Count Adjustment",
    description: `Based on ${numPassengers} passengers`,
    amount: passengerPrice
  });
  
  // 3. Calculate estimated distance fee (would use actual coordinates in production)
  // This is a simplified calculation for the MVP
  const distanceFee = 85;
  breakdown.push({
    name: "Distance Fee",
    description: "Estimated based on route",
    amount: distanceFee
  });
  
  // 4. Calculate duration fee (would use API in production)
  const durationFee = 120;
  breakdown.push({
    name: "Duration Fee",
    description: "Estimated trip time",
    amount: durationFee
  });
  
  // 5. Calculate amenities fees
  if (amenities && amenities.length > 0) {
    const amenitiesFees = amenities.length * 25;
    breakdown.push({
      name: "Additional Amenities",
      description: `${amenities.length} amenities selected`,
      amount: amenitiesFees
    });
  }
  
  // 6. Round trip multiplier
  const tripMultiplier = tripType === 'roundTrip' ? 1.8 : 1;
  if (tripType === 'roundTrip') {
    breakdown.push({
      name: "Round Trip Multiplier",
      description: "Return journey discount applied",
      amount: 0,
      multiplier: 1.8
    });
  }
  
  // Calculate subtotal
  let subtotal = 0;
  breakdown.forEach(item => {
    subtotal += item.amount;
  });
  
  // Apply round trip multiplier
  subtotal *= tripMultiplier;
  
  // Calculate service fee (10% of subtotal)
  const serviceFee = subtotal * 0.10;
  
  // Calculate total
  const total = subtotal + serviceFee;
  
  // Set quote expiration (24 hours from now)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);
  
  // Create and return the quote response
  return {
    quoteId: uuidv4(),
    tripDetails,
    breakdown,
    subtotal,
    serviceFee,
    total,
    expiresAt: expiresAt.toISOString()
  };
}
