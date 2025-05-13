import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date for inputs
export function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

// Format date/time for display
export function formatDateTime(dateStr: string, timeStr?: string): string {
  const date = new Date(timeStr ? `${dateStr}T${timeStr}` : dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: timeStr ? '2-digit' : undefined,
    minute: timeStr ? '2-digit' : undefined,
  });
}

// Generate next week's date
export function getNextWeekDate(): Date {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  return nextWeek;
}

// Convert amenities from array to readable string
export function formatAmenities(amenities: string[]): string {
  if (!amenities || amenities.length === 0) return 'None selected';
  
  return amenities
    .map(amenity => {
      // Convert camelCase to Title Case
      const formatted = amenity
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
      return formatted;
    })
    .join(', ');
}

// Capitalize first letter of each word
export function capitalize(str: string): string {
  return str.replace(
    /\w\S*/g,
    txt => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  );
}

// Convert busType to display name
export function formatBusType(busType: string): string {
  switch (busType) {
    case 'standard':
      return 'Standard Charter Bus';
    case 'luxury':
      return 'Luxury Charter Bus';
    default:
      return capitalize(busType);
  }
}
