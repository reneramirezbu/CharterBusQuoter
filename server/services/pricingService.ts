import { 
  QuoteRequest, 
  QuoteResponse,
  QuoteBreakdownItem
} from '@shared/schema';
import { v4 as uuidv4 } from 'uuid';

/**
 * Calculate a quote based on trip details
 * 
 * This service is responsible for calculating accurate price quotes based on 
 * trip details including passenger count, bus type, trip type, and selected amenities.
 * 
 * @param tripDetails The details of the trip from the quote request
 * @returns A complete quote response with breakdown, subtotal, service fee, and total
 */
export function calculateQuote(tripDetails: QuoteRequest): QuoteResponse {
  const {
    numPassengers,
    busType,
    amenities = [],
    tripType,
    pickupLocation,
    dropoffLocation
  } = tripDetails;

  const breakdown: QuoteBreakdownItem[] = [];
  
  // 1. Base Price based on Bus Type
  const basePrice = busType === 'luxury' ? 200 : 100;
  breakdown.push({
    name: `Base Price (${busType})`,
    description: `Starting price for ${busType} charter bus`,
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
  
  // 3. Calculate distance fee using coordinates if available
  // For a production app, this would use a directions API to get actual distance
  let distanceFee = 85; // Default estimate
  
  // If we have coordinates from both locations, we could calculate a more accurate fee
  if (pickupLocation.lat && pickupLocation.lng && 
      dropoffLocation.lat && dropoffLocation.lng) {
    // Basic calculation for demo - this should use a proper distance calculation in production
    const latDiff = Math.abs(pickupLocation.lat - dropoffLocation.lat);
    const lngDiff = Math.abs(pickupLocation.lng - dropoffLocation.lng);
    const roughDistance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // km per degree at equator
    
    // Adjust fee based on rough distance (simplified)
    if (roughDistance > 50) distanceFee = 150;
    else if (roughDistance > 20) distanceFee = 120;
  }
  
  breakdown.push({
    name: "Distance Fee",
    description: `From ${pickupLocation.formattedAddress.split(',')[0]} to ${dropoffLocation.formattedAddress.split(',')[0]}`,
    amount: distanceFee
  });
  
  // 4. Calculate duration fee
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
  let subtotal = breakdown.reduce((sum, item) => sum + item.amount, 0);
  
  // Apply round trip multiplier
  subtotal *= tripMultiplier;
  
  // Calculate service fee (10% of subtotal)
  const serviceFee = Math.round(subtotal * 0.10 * 100) / 100;
  
  // Calculate total
  const total = Math.round((subtotal + serviceFee) * 100) / 100;
  
  // Set quote expiration (24 hours from now)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);
  
  // Create and return the quote response
  return {
    quoteId: uuidv4(),
    tripDetails,
    breakdown,
    subtotal: Math.round(subtotal * 100) / 100, // Round to 2 decimal places
    serviceFee,
    total,
    expiresAt: expiresAt.toISOString()
  };
}
