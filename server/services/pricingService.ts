import { QuoteRequest, QuoteResponse, QuoteBreakdownItem } from '../../shared/schema';
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
export async function calculateQuote(tripDetails: QuoteRequest): Promise<QuoteResponse> {
  // Base rates
  const BASE_RATE_PER_MILE = tripDetails.busType === 'luxury' ? 4.5 : 3.25;
  const MINIMUM_FARE = tripDetails.busType === 'luxury' ? 450 : 350;
  const SERVICE_FEE_PERCENTAGE = 0.05; // 5% service fee
  const AMENITIES_PRICING = {
    wifi: 25,
    lavatory: 35,
    entertainment: 45,
    powerOutlets: 20
  };
  
  // Calculate distance between pickup and dropoff locations
  const distance = await calculateDistance(
    tripDetails.pickupLocation,
    tripDetails.dropoffLocation
  );
  
  // Calculate base fare
  const baseFare = Math.max(distance * BASE_RATE_PER_MILE, MINIMUM_FARE);
  
  // Round trip multiplier
  const tripMultiplier = tripDetails.tripType === 'roundTrip' ? 1.85 : 1;
  
  // Calculate amenities total
  const amenitiesTotal = (tripDetails.amenities || []).reduce((total, amenity) => {
    return total + (AMENITIES_PRICING[amenity as keyof typeof AMENITIES_PRICING] || 0);
  }, 0);
  
  // Create breakdown items
  const breakdown: QuoteBreakdownItem[] = [
    {
      name: 'Base Fare',
      description: `${distance} miles at ${BASE_RATE_PER_MILE.toFixed(2)}/mile`,
      amount: baseFare,
    },
    {
      name: 'Trip Type',
      description: tripDetails.tripType === 'roundTrip' 
        ? 'Round trip (85% surcharge)'
        : 'One way trip',
      amount: baseFare * (tripMultiplier - 1),
    }
  ];
  
  // Add amenities to breakdown if any
  if (amenitiesTotal > 0) {
    breakdown.push({
      name: 'Amenities',
      description: `${tripDetails.amenities?.join(', ')}`,
      amount: amenitiesTotal,
    });
  }
  
  // Calculate subtotal
  const subtotal = (baseFare * tripMultiplier) + amenitiesTotal;
  
  // Calculate service fee
  const serviceFee = subtotal * SERVICE_FEE_PERCENTAGE;
  
  // Calculate total
  const total = subtotal + serviceFee;
  
  // Generate quote ID
  const quoteId = uuidv4();
  
  // Create expiration time (24 hours from now)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);
  
  // Return quote response
  return {
    quoteId,
    tripDetails,
    breakdown,
    subtotal,
    serviceFee,
    total,
    createdAt: new Date().toISOString(),
    expiresAt: expiresAt.toISOString()
  };
}

/**
 * Calculate distance between two locations using Google Maps Distance Matrix API
 * or a distance calculation algorithm.
 * 
 * For this implementation, we're using a simplified calculation based on
 * coordinates (Haversine formula) instead of calling the Google API.
 * In a production environment, you would use the Google Maps API for accuracy.
 */
async function calculateDistance(pickup: any, dropoff: any): Promise<number> {
  // If we have coordinates, use them to calculate distance
  if (pickup.lat && pickup.lng && dropoff.lat && dropoff.lng) {
    return await haversineDistance(
      { lat: pickup.lat, lng: pickup.lng },
      { lat: dropoff.lat, lng: dropoff.lng }
    );
  }
  
  // Fallback to addresses if we have them
  if (pickup.formattedAddress && dropoff.formattedAddress) {
    // Simple distance estimation based on addresses would go here
    // In a real implementation, you'd call the Google Distance Matrix API
    return 50; // Default to 50 miles if we can't calculate precisely
  }
  
  // Default fallback
  return 50;
}

/**
 * Calculate the haversine distance between two points on Earth
 * @param pointA Coordinates of first point {lat, lng}
 * @param pointB Coordinates of second point {lat, lng}
 * @returns Distance in miles
 */
async function haversineDistance(pointA: {lat: number, lng: number}, pointB: {lat: number, lng: number}): Promise<number> {
  // Simulate async operation
  return new Promise((resolve) => {
    setTimeout(() => {
      const R = 3958.8; // Earth's radius in miles
      
      // Convert lat/lng to radians
      const dLat = toRadians(pointB.lat - pointA.lat);
      const dLng = toRadians(pointB.lng - pointA.lng);
      
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(pointA.lat)) * Math.cos(toRadians(pointB.lat)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
      
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      
      // Round to 1 decimal place
      resolve(Math.round(distance * 10) / 10);
    }, 100); // Simulate network delay
  });
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}