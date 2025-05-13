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
  
  // Collect form data
  const formData = {
    tripType: document.getElementById('trip-type').value,
    pickupLocation: document.getElementById('pickup-location').value,
    dropoffLocation: document.getElementById('dropoff-location').value,
    departureDate: document.getElementById('departure-date').value,
    departureTime: document.getElementById('departure-time').value,
    passengerCount: document.getElementById('passenger-count').value
  };
  
  // If round-trip, add return date/time
  if (formData.tripType === 'round-trip') {
    formData.returnDate = document.getElementById('return-date').value;
    formData.returnTime = document.getElementById('return-time').value;
  }
  
  console.log('Quote request data:', formData);
  
  // In a real implementation, this would be an API call
  // For now, just show a success message without an alert popup
  const quoteForm = document.getElementById('charter-quote-form');
  
  // Create a success message element if it doesn't exist
  let successMessage = document.getElementById('quote-success-message');
  if (!successMessage) {
    successMessage = document.createElement('div');
    successMessage.id = 'quote-success-message';
    successMessage.className = 'results';
    successMessage.innerHTML = `
      <h3>Quote Request Submitted</h3>
      <p>Thank you for your request. In a real implementation, this would generate a quote based on your trip details.</p>
    `;
    
    // Add it after the form
    quoteForm.parentNode.insertBefore(successMessage, quoteForm.nextSibling);
  }
  
  // Hide the form, show the success message
  quoteForm.style.display = 'none';
  successMessage.style.display = 'block';
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