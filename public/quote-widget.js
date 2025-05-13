/**
 * Initializes Google Places Autocomplete for address inputs
 */
function initAutocomplete() {
  console.log("Initializing Google Places Autocomplete");
  
  // Retry functionality to make sure elements exist
  setTimeout(function() {
    // Initialize autocomplete for pickup location
    const pickupElement = document.getElementById('pickup-location');
    if (pickupElement) {
      console.log("Found pickup element, initializing autocomplete");
      const pickupAutocomplete = new google.maps.places.Autocomplete(pickupElement, {
        types: ['address']
      });
      
      pickupAutocomplete.addListener('place_changed', function() {
        const place = pickupAutocomplete.getPlace();
        console.log("Selected pickup place:", place);
      });
    } else {
      console.error("Could not find pickup-location element");
    }
    
    // Initialize autocomplete for dropoff location
    const dropoffElement = document.getElementById('dropoff-location');
    if (dropoffElement) {
      console.log("Found dropoff element, initializing autocomplete");
      const dropoffAutocomplete = new google.maps.places.Autocomplete(dropoffElement, {
        types: ['address']
      });
      
      dropoffAutocomplete.addListener('place_changed', function() {
        const place = dropoffAutocomplete.getPlace();
        console.log("Selected dropoff place:", place);
      });
    } else {
      console.error("Could not find dropoff-location element");
    }
  }, 100); // Small delay to ensure DOM is ready
}

/**
 * Shows or hides return date fields based on trip type
 */
function toggleReturnDateFields() {
  const tripType = document.getElementById('trip-type').value;
  const returnDateContainer = document.getElementById('return-date-container');
  
  if (tripType === 'round-trip') {
    returnDateContainer.style.display = 'block';
    document.getElementById('return-date').required = true;
    document.getElementById('return-time').required = true;
  } else {
    returnDateContainer.style.display = 'none';
    document.getElementById('return-date').required = false;
    document.getElementById('return-time').required = false;
  }
}

/**
 * Handles form submission to get a quote
 */
function handleSubmit(event) {
  event.preventDefault();
  
  // Show a simple alert for demonstration purposes
  alert('Quote request submitted. In a real implementation, this would make an API call to generate a quote.');
  
  // In a real implementation, you would:
  // 1. Collect form data
  // 2. Make an API call to your backend
  // 3. Display the result to the user
}

// Set up event listeners when the page loads
document.addEventListener('DOMContentLoaded', function() {
  // Set up trip type change handler
  const tripTypeSelect = document.getElementById('trip-type');
  if (tripTypeSelect) {
    tripTypeSelect.addEventListener('change', toggleReturnDateFields);
    // Initialize state based on current selection
    toggleReturnDateFields();
  }
  
  // Set up form submission handler
  const form = document.getElementById('charter-quote-form');
  if (form) {
    form.addEventListener('submit', handleSubmit);
  }
});