/**
 * Charter Bus Quote Widget for Elementor
 * 
 * This script handles the functionality of the Charter Bus Quote widget when embedded in WordPress
 * with Elementor. It adds Google Maps Places Autocomplete to location inputs and handles form submission.
 */

(function() {
  // Initialize the widget when the DOM is loaded
  document.addEventListener('DOMContentLoaded', initWidget);

  // Widget state
  let apiKey = '';
  let apiUrl = '';
  let tripType = 'oneWay';
  let placesAutocomplete = {
    pickup: null,
    dropoff: null
  };

  /**
   * Initialize the quote widget
   */
  function initWidget() {
    // Find the container element
    const container = document.getElementById('charter-quote-widget');
    if (!container) {
      console.error('Container element #charter-quote-widget not found');
      return;
    }

    // Get configuration from data attributes or use defaults
    apiUrl = container.getAttribute('data-api-url') || 'https://charter-bus-quote.replit.app';
    
    // Set up event listeners
    setupFormEventListeners();
    
    // Initialize Google Maps API
    loadGoogleMapsAPI();
  }

  /**
   * Load Google Maps API with the API key
   */
  function loadGoogleMapsAPI() {
    // First fetch the API key from the server (more secure than embedding it)
    fetch(`${apiUrl}/api/google-maps-key`)
      .then(response => response.json())
      .then(data => {
        apiKey = data.apiKey;
        
        // Create script element for Google Maps API
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initPlacesAutocomplete`;
        script.async = true;
        script.defer = true;
        
        // Define the callback function globally
        window.initPlacesAutocomplete = initPlacesAutocomplete;
        
        // Add script to document
        document.head.appendChild(script);
      })
      .catch(error => {
        console.error('Error fetching Google Maps API key:', error);
        showError('Could not load location services. Please try again later.');
      });
  }

  /**
   * Initialize Google Places Autocomplete on location inputs
   */
  function initPlacesAutocomplete() {
    const pickupInput = document.getElementById('pickupLocation');
    const dropoffInput = document.getElementById('dropoffLocation');
    
    if (pickupInput && window.google) {
      placesAutocomplete.pickup = new google.maps.places.Autocomplete(pickupInput, {
        types: ['address'],
        componentRestrictions: { country: ['us'] },
        fields: ['place_id', 'formatted_address', 'geometry']
      });
    }
    
    if (dropoffInput && window.google) {
      placesAutocomplete.dropoff = new google.maps.places.Autocomplete(dropoffInput, {
        types: ['address'],
        componentRestrictions: { country: ['us'] },
        fields: ['place_id', 'formatted_address', 'geometry']
      });
    }
    
    console.log('Google Maps API loaded successfully');
  }

  /**
   * Set up all event listeners for the form
   */
  function setupFormEventListeners() {
    // Trip type selection
    const tripOptions = document.querySelectorAll('.trip-option');
    tripOptions.forEach(option => {
      option.addEventListener('click', function() {
        // Remove active class from all options
        tripOptions.forEach(opt => opt.classList.remove('active'));
        
        // Add active class to selected option
        this.classList.add('active');
        
        // Update trip type
        tripType = this.getAttribute('data-trip-type');
        
        // Show/hide return date field
        const returnDateGroup = document.getElementById('returnDateGroup');
        if (returnDateGroup) {
          returnDateGroup.style.display = tripType === 'roundTrip' ? 'block' : 'none';
        }
      });
    });
    
    // Set minimum dates for departure and return
    const today = new Date().toISOString().split('T')[0];
    const departureDate = document.getElementById('departureDate');
    const returnDate = document.getElementById('returnDate');
    
    if (departureDate) {
      departureDate.min = today;
      
      // Update return date min when departure date changes
      departureDate.addEventListener('change', function() {
        if (returnDate) {
          returnDate.min = this.value;
        }
      });
    }
    
    // Get quote button
    const getQuoteBtn = document.getElementById('getQuote');
    if (getQuoteBtn) {
      getQuoteBtn.addEventListener('click', submitQuoteRequest);
    }
    
    // New quote button
    const newQuoteBtn = document.getElementById('newQuote');
    if (newQuoteBtn) {
      newQuoteBtn.addEventListener('click', resetForm);
    }
  }

  /**
   * Submit the quote request to the API
   */
  function submitQuoteRequest() {
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Show loading state
    toggleLoading(true);
    
    // Get form data
    const formData = getFormData();
    
    // Submit request to API
    fetch(`${apiUrl}/api/quotes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to generate quote. Please try again.');
      }
      return response.json();
    })
    .then(quoteData => {
      displayQuoteResults(quoteData);
      toggleLoading(false);
    })
    .catch(error => {
      showError(error.message);
      toggleLoading(false);
    });
  }

  /**
   * Validate all form fields
   */
  function validateForm() {
    // Clear previous errors
    clearErrors();
    
    let isValid = true;
    
    // Required fields
    const requiredFields = [
      { id: 'numPassengers', message: 'Please enter the number of passengers' },
      { id: 'departureDate', message: 'Please select a departure date' },
      { id: 'departureTime', message: 'Please select a departure time' },
      { id: 'pickupLocation', message: 'Please enter a pickup location' },
      { id: 'dropoffLocation', message: 'Please enter a dropoff location' }
    ];
    
    // Add return date if round trip
    if (tripType === 'roundTrip') {
      requiredFields.push({ id: 'returnDate', message: 'Please select a return date' });
    }
    
    // Check each required field
    requiredFields.forEach(field => {
      const element = document.getElementById(field.id);
      if (!element || !element.value.trim()) {
        showFieldError(field.id, field.message);
        isValid = false;
      }
    });
    
    // Validate number of passengers
    const passengersInput = document.getElementById('numPassengers');
    if (passengersInput && (isNaN(passengersInput.value) || parseInt(passengersInput.value) < 1)) {
      showFieldError('numPassengers', 'Please enter a valid number of passengers');
      isValid = false;
    }
    
    return isValid;
  }

  /**
   * Get all form data as an object
   */
  function getFormData() {
    const pickupPlace = placesAutocomplete.pickup ? placesAutocomplete.pickup.getPlace() : null;
    const dropoffPlace = placesAutocomplete.dropoff ? placesAutocomplete.dropoff.getPlace() : null;
    
    return {
      tripType: tripType,
      numPassengers: parseInt(document.getElementById('numPassengers').value),
      departureDate: document.getElementById('departureDate').value,
      departureTime: document.getElementById('departureTime').value,
      returnDate: tripType === 'roundTrip' ? document.getElementById('returnDate').value : null,
      pickupLocation: {
        placeId: pickupPlace ? pickupPlace.place_id : '',
        formattedAddress: pickupPlace ? pickupPlace.formatted_address : document.getElementById('pickupLocation').value,
        addressInput: document.getElementById('pickupLocation').value,
        lat: pickupPlace && pickupPlace.geometry ? pickupPlace.geometry.location.lat() : null,
        lng: pickupPlace && pickupPlace.geometry ? pickupPlace.geometry.location.lng() : null
      },
      dropoffLocation: {
        placeId: dropoffPlace ? dropoffPlace.place_id : '',
        formattedAddress: dropoffPlace ? dropoffPlace.formatted_address : document.getElementById('dropoffLocation').value,
        addressInput: document.getElementById('dropoffLocation').value,
        lat: dropoffPlace && dropoffPlace.geometry ? dropoffPlace.geometry.location.lat() : null,
        lng: dropoffPlace && dropoffPlace.geometry ? dropoffPlace.geometry.location.lng() : null
      },
      busType: 'standard', // Always standard
      amenities: [] // No amenities
    };
  }

  /**
   * Display the quote results
   */
  function displayQuoteResults(quoteData) {
    const form = document.querySelector('#charter-quote-widget form');
    const results = document.getElementById('quoteResults');
    
    if (!results || !form) {
      return;
    }
    
    // Hide form, show results
    form.style.display = 'none';
    results.style.display = 'block';
    
    // Format data for display
    const tripDetails = quoteData.tripDetails;
    const departureDate = new Date(tripDetails.departureDate);
    const formattedDepartureDate = departureDate.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    // Fill in the results template
    results.innerHTML = `
      <h3>Your Quote Summary</h3>
      
      <div class="trip-details">
        <p><strong>Pickup:</strong> ${tripDetails.pickupLocation.formattedAddress}</p>
        <p><strong>Dropoff:</strong> ${tripDetails.dropoffLocation.formattedAddress}</p>
        <p><strong>Date:</strong> ${formattedDepartureDate} at ${formatTime(tripDetails.departureTime)}</p>
        <p><strong>Trip Type:</strong> ${tripDetails.tripType === 'oneWay' ? 'One Way' : 'Round Trip'}</p>
        <p><strong>Passengers:</strong> ${tripDetails.numPassengers}</p>
        <p><strong>Bus Type:</strong> Standard Charter Bus</p>
      </div>
      
      <div class="quote-breakdown">
        <h4>Quote Breakdown</h4>
        
        ${quoteData.breakdown.map(item => `
          <div class="breakdown-item">
            <span>${item.description}</span>
            <span>${formatCurrency(item.amount)}</span>
          </div>
        `).join('')}
        
        <div class="breakdown-item subtotal">
          <span>Subtotal</span>
          <span>${formatCurrency(quoteData.subtotal)}</span>
        </div>
        
        <div class="breakdown-item">
          <span>Service Fee</span>
          <span>${formatCurrency(quoteData.serviceFee)}</span>
        </div>
        
        <div class="breakdown-item total">
          <span>Total</span>
          <span>${formatCurrency(quoteData.total)}</span>
        </div>
      </div>
      
      <button type="button" id="newQuote" onclick="resetForm()">Get Another Quote</button>
    `;
  }

  /**
   * Reset the form to get a new quote
   */
  function resetForm() {
    const form = document.querySelector('#charter-quote-widget form');
    const results = document.getElementById('quoteResults');
    
    if (form && results) {
      // Show form, hide results
      form.style.display = 'block';
      results.style.display = 'none';
      
      // Reset form fields
      form.reset();
      
      // Reset trip type to one way
      const tripOptions = document.querySelectorAll('.trip-option');
      tripOptions.forEach(option => {
        option.classList.toggle('active', option.getAttribute('data-trip-type') === 'oneWay');
      });
      
      tripType = 'oneWay';
      
      // Hide return date field
      const returnDateGroup = document.getElementById('returnDateGroup');
      if (returnDateGroup) {
        returnDateGroup.style.display = 'none';
      }
    }
  }

  /**
   * Show an error message for a specific field
   */
  function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    // Add error class to field
    field.classList.add('error');
    
    // Create or update error message
    let errorElement = document.getElementById(`${fieldId}-error`);
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.id = `${fieldId}-error`;
      errorElement.className = 'error-message';
      field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
  }

  /**
   * Clear all error messages
   */
  function clearErrors() {
    // Remove error class from all fields
    const errorFields = document.querySelectorAll('.error');
    errorFields.forEach(field => field.classList.remove('error'));
    
    // Remove all error messages
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(message => message.remove());
  }

  /**
   * Show a general error message
   */
  function showError(message) {
    const container = document.getElementById('charter-quote-widget');
    if (!container) return;
    
    // Create error element
    const errorElement = document.createElement('div');
    errorElement.className = 'error-banner';
    errorElement.innerHTML = `
      <p>${message}</p>
      <button type="button" onclick="this.parentNode.remove()">×</button>
    `;
    
    // Add to container
    container.insertBefore(errorElement, container.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (errorElement.parentNode) {
        errorElement.remove();
      }
    }, 5000);
  }

  /**
   * Toggle loading state
   */
  function toggleLoading(isLoading) {
    const getQuoteBtn = document.getElementById('getQuote');
    if (getQuoteBtn) {
      getQuoteBtn.disabled = isLoading;
      getQuoteBtn.textContent = isLoading ? 'Processing...' : 'Get Your Quote';
    }
  }

  /**
   * Format a time string (HH:MM) to a more readable format
   */
  function formatTime(timeStr) {
    if (!timeStr) return '';
    
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    return `${hour12}:${minutes} ${ampm}`;
  }

  /**
   * Format a number as currency
   */
  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  }
})();