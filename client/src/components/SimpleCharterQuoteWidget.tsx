import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { QuoteRequest, QuoteResponse, Location } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatDateTime } from "@/lib/utils";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckboxItem } from "./ui/checkbox-item";
import LocationInput from "./LocationInput";

/**
 * Simple Charter Bus Quote Widget
 * 
 * A lightweight, standalone widget that can be embedded in any website (including Elementor)
 * to provide charter bus quote functionality.
 */
export const SimpleCharterQuoteWidget: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  
  // Default form values
  const [formData, setFormData] = useState<QuoteRequest>({
    tripType: "oneWay",
    numPassengers: 1,
    departureDate: "",
    departureTime: "",
    pickupLocation: {
      placeId: "",
      formattedAddress: "",
      addressInput: ""
    },
    dropoffLocation: {
      placeId: "",
      formattedAddress: "",
      addressInput: ""
    },
    busType: "standard", // Always standard bus
    amenities: [] // No amenities
  });
  
  // Ensure busType is always "standard" and amenities is empty
  React.useEffect(() => {
    setFormData(prev => ({ 
      ...prev, 
      busType: "standard", 
      amenities: [] 
    }));
  }, []);
  
  // Create a mutation for submitting the quote request
  const { mutate, data: quoteData, isPending } = useMutation<QuoteResponse>({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/quotes', formData);
      return response.json();
    },
    onSuccess: () => {
      setCurrentStep(3);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate quote. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Form navigation and validation
  const handleNextStep = () => {
    // Validate form data
    const validationErrors: Record<string, string> = {};
    
    if (currentStep === 1) {
      if (!formData.numPassengers || formData.numPassengers < 1) {
        validationErrors.numPassengers = "Please enter a valid number of passengers";
      }
      
      if (!formData.departureDate) {
        validationErrors.departureDate = "Please select a departure date";
      }
      
      if (!formData.departureTime) {
        validationErrors.departureTime = "Please select a departure time";
      }
      
      if (formData.tripType === "roundTrip" && !formData.returnDate) {
        validationErrors.returnDate = "Please select a return date";
      }
      
      if (!formData.pickupLocation.placeId) {
        validationErrors.pickupLocation = "Please select a valid pickup location";
      }
      
      if (!formData.dropoffLocation.placeId) {
        validationErrors.dropoffLocation = "Please select a valid dropoff location";
      }
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Clear errors and proceed to next step
    setErrors({});
    setCurrentStep(prev => prev + 1);
  };
  
  const handlePreviousStep = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  const handleGetQuote = () => {
    mutate();
  };
  
  // Handle form changes
  const handleTripTypeChange = (tripType: "oneWay" | "roundTrip") => {
    setFormData(prev => ({ ...prev, tripType }));
  };
  
  const handleNumPassengersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setFormData(prev => ({ ...prev, numPassengers: value }));
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePickupLocationChange = (location: Location) => {
    setFormData(prev => ({ ...prev, pickupLocation: location }));
  };
  
  const handleDropoffLocationChange = (location: Location) => {
    setFormData(prev => ({ ...prev, dropoffLocation: location }));
  };

  // Calculate minimum date (today)
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];

  return (
    <>
      <h2>Charter Bus Quote</h2>
      <p>Complete the form below to get an instant quote for your charter bus trip.</p>
      
      {/* Step Indicator */}
      <div className="progress-steps">
        {['Trip Details', 'Bus Options', 'Quote Summary'].map((label, index) => (
          <div key={index} className={`progress-step ${currentStep >= index + 1 ? 'active' : ''}`}>
            <span className="step-number">{index + 1}</span>
            <span className="step-label">{label}</span>
          </div>
        ))}
      </div>
      
      {/* Step 1: Trip Details */}
      {currentStep === 1 && (
        <div className="form-step">
          <div className="form-group">
            <label>Trip Type</label>
            <div className="trip-type-options">
              <button 
                type="button" 
                className={formData.tripType === "oneWay" ? "active" : ""}
                onClick={() => handleTripTypeChange("oneWay")}
              >
                One Way
              </button>
              <button 
                type="button" 
                className={formData.tripType === "roundTrip" ? "active" : ""}
                onClick={() => handleTripTypeChange("roundTrip")}
              >
                Round Trip
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="numPassengers">Number of Passengers</label>
            <input
              type="number"
              id="numPassengers"
              min="1"
              max="100"
              value={formData.numPassengers}
              onChange={handleNumPassengersChange}
              required
            />
            {errors.numPassengers && <div className="error">{errors.numPassengers}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="departureDate">Departure Date</label>
            <input
              type="date"
              id="departureDate"
              name="departureDate"
              min={minDate}
              value={formData.departureDate}
              onChange={handleDateChange}
              required
            />
            {errors.departureDate && <div className="error">{errors.departureDate}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="departureTime">Departure Time</label>
            <input
              type="time"
              id="departureTime"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleDateChange}
              required
            />
            {errors.departureTime && <div className="error">{errors.departureTime}</div>}
          </div>
          
          {formData.tripType === "roundTrip" && (
            <div className="form-group">
              <label htmlFor="returnDate">Return Date</label>
              <input
                type="date"
                id="returnDate"
                name="returnDate"
                min={formData.departureDate || minDate}
                value={formData.returnDate || ""}
                onChange={handleDateChange}
                required
              />
              {errors.returnDate && <div className="error">{errors.returnDate}</div>}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="pickupLocation">Pickup Location</label>
            <LocationInput
              id="pickupLocation"
              label="Pickup Location"
              placeholder="Enter pickup address"
              value={formData.pickupLocation?.addressInput || ""}
              onChange={handlePickupLocationChange}
              error={errors.pickupLocation}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="dropoffLocation">Dropoff Location</label>
            <LocationInput
              id="dropoffLocation"
              label="Dropoff Location"
              placeholder="Enter destination address"
              value={formData.dropoffLocation?.addressInput || ""}
              onChange={handleDropoffLocationChange}
              error={errors.dropoffLocation}
              required
            />
          </div>
          
          <button type="button" className="btn-next" onClick={handleNextStep}>
            Continue
          </button>
        </div>
      )}
      
      {/* Step 2: Bus Options (Simplified - Only Standard Bus) */}
      {currentStep === 2 && (
        <div className="form-step">
          <div className="bus-option">
            <h4>Standard Charter Bus</h4>
            <p>Comfortable seating for up to 56 passengers with essential amenities.</p>
            <input type="hidden" name="busType" value="standard" />
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-back" onClick={handlePreviousStep}>
              Back
            </button>
            <button 
              type="button" 
              className="btn-next" 
              onClick={handleGetQuote}
              disabled={isPending}
            >
              {isPending ? "Processing..." : "Get Quote"}
            </button>
          </div>
        </div>
      )}
      
      {/* Step 3: Quote Summary */}
      {currentStep === 3 && quoteData && (
        <div className="form-step">
          <div className="results">
            <h3>Your Quote Summary</h3>
            
            <div className="trip-details">
              <div className="detail-item">
                <strong>Pickup:</strong> {quoteData.tripDetails.pickupLocation.formattedAddress}
              </div>
              <div className="detail-item">
                <strong>Dropoff:</strong> {quoteData.tripDetails.dropoffLocation.formattedAddress}
              </div>
              <div className="detail-item">
                <strong>Date:</strong> {formatDateTime(quoteData.tripDetails.departureDate, quoteData.tripDetails.departureTime)}
              </div>
              <div className="detail-item">
                <strong>Trip Type:</strong> {quoteData.tripDetails.tripType === "oneWay" ? "One Way" : "Round Trip"}
              </div>
              <div className="detail-item">
                <strong>Passengers:</strong> {quoteData.tripDetails.numPassengers}
              </div>
              <div className="detail-item">
                <strong>Bus Type:</strong> Standard Charter Bus
              </div>
            </div>
            
            <div className="quote-breakdown">
              <h4>Quote Breakdown</h4>
              
              {quoteData.breakdown.map((item, index) => (
                <div key={index} className="breakdown-item">
                  <span>{item.description}</span>
                  <span>{formatCurrency(item.amount)}</span>
                </div>
              ))}
              
              <div className="subtotal breakdown-item">
                <span>Subtotal</span>
                <span>{formatCurrency(quoteData.subtotal)}</span>
              </div>
              
              <div className="service-fee breakdown-item">
                <span>Service Fee</span>
                <span>{formatCurrency(quoteData.serviceFee)}</span>
              </div>
              
              <div className="total breakdown-item">
                <span>Total</span>
                <span>{formatCurrency(quoteData.total)}</span>
              </div>
            </div>
            
            <div className="form-actions">
              <button type="button" className="btn-back" onClick={handlePreviousStep}>
                Back
              </button>
              <button type="button" className="btn-next" onClick={() => setCurrentStep(1)}>
                New Quote
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SimpleCharterQuoteWidget;