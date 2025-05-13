import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { QuoteRequest, QuoteResponse, Location } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatDateTime, formatAmenities, formatBusType } from "@/lib/utils";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckboxItem } from "./ui/checkbox-item";
import LocationInput from "./LocationInput";

/**
 * Charter Bus Quote Widget
 * 
 * A standalone widget that can be embedded in any website (including Elementor)
 * to provide charter bus quote functionality.
 */
const CharterBusQuoteWidget: React.FC = () => {
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
  
  // Bus type is always standard and there are no amenities - removed handlers
  
  const handleSpecialRequirementsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, specialRequirements: e.target.value }));
  };

  // Calculate minimum date (today)
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];

  return (
    <div className="charter-bus-quote-widget bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <div className="widget-header mb-6">
        <h2 className="font-heading font-bold text-xl sm:text-2xl text-gray-800 mb-2">Charter Bus Quote</h2>
        <p className="text-gray-600 text-sm">Complete the form below to get an instant quote for your charter bus trip.</p>
      </div>
      
      {/* Step Indicator */}
      <div className="flex justify-between items-center mb-6">
        {['Trip Details', 'Bus Options', 'Quote Summary'].map((label, index) => (
          <div key={index} className="flex items-center">
            <div className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-1
                  ${currentStep >= index + 1 
                    ? "border-primary bg-primary-100 text-primary" 
                    : "text-gray-400 border-gray-300"}`}
              >
                <span className="font-medium text-sm">{index + 1}</span>
              </div>
              <span 
                className={`text-xs font-medium ${currentStep >= index + 1 ? "text-primary" : "text-gray-400"}`}
              >
                {label}
              </span>
            </div>
            
            {index < 2 && (
              <div 
                className={`flex-1 h-0.5 w-12 mx-2
                  ${index < currentStep - 1 ? "bg-primary" : "bg-gray-200"}`}
              ></div>
            )}
          </div>
        ))}
      </div>
      
      {/* Form Content */}
      <form id="charterQuoteForm" onSubmit={(e) => e.preventDefault()}>
        {/* Step 1: Trip Details */}
        {currentStep === 1 && (
          <div className="step-content">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Trip Type */}
              <div className="form-group">
                <Label className="block text-sm font-medium text-gray-700 mb-1">Trip Type</Label>
                <div className="grid grid-cols-2 gap-3">
                  <CheckboxItem
                    type="radio"
                    name="tripType"
                    label="One Way"
                    checked={formData.tripType === "oneWay"}
                    onChange={() => handleTripTypeChange("oneWay")}
                  />
                  <CheckboxItem
                    type="radio"
                    name="tripType"
                    label="Round Trip"
                    checked={formData.tripType === "roundTrip"}
                    onChange={() => handleTripTypeChange("roundTrip")}
                  />
                </div>
              </div>

              {/* Number of Passengers */}
              <div className="form-group">
                <Label htmlFor="numPassengers" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Passengers
                </Label>
                <Input
                  type="number"
                  id="numPassengers"
                  name="numPassengers"
                  min={1}
                  max={100}
                  value={formData.numPassengers || ""}
                  onChange={handleNumPassengersChange}
                  className={errors.numPassengers ? "border-red-500" : ""}
                  placeholder="Enter number of passengers"
                  required
                />
                {errors.numPassengers && (
                  <p className="mt-1 text-xs text-red-500">{errors.numPassengers}</p>
                )}
              </div>
            </div>

            {/* Trip Date & Time Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Departure Date */}
              <div className="form-group">
                <Label htmlFor="departureDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Departure Date
                </Label>
                <Input
                  type="date"
                  id="departureDate"
                  name="departureDate"
                  min={minDate}
                  value={formData.departureDate || ""}
                  onChange={handleDateChange}
                  className={errors.departureDate ? "border-red-500" : ""}
                  required
                />
                {errors.departureDate && (
                  <p className="mt-1 text-xs text-red-500">{errors.departureDate}</p>
                )}
              </div>

              {/* Departure Time */}
              <div className="form-group">
                <Label htmlFor="departureTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Departure Time
                </Label>
                <Input
                  type="time"
                  id="departureTime"
                  name="departureTime"
                  value={formData.departureTime || ""}
                  onChange={handleDateChange}
                  className={errors.departureTime ? "border-red-500" : ""}
                  required
                />
                {errors.departureTime && (
                  <p className="mt-1 text-xs text-red-500">{errors.departureTime}</p>
                )}
              </div>

              {/* Return Date (shown/hidden based on trip type) */}
              {formData.tripType === "roundTrip" && (
                <div className="form-group">
                  <Label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Return Date
                  </Label>
                  <Input
                    type="date"
                    id="returnDate"
                    name="returnDate"
                    min={formData.departureDate || minDate}
                    value={formData.returnDate || ""}
                    onChange={handleDateChange}
                    className={errors.returnDate ? "border-red-500" : ""}
                    required
                  />
                  {errors.returnDate && (
                    <p className="mt-1 text-xs text-red-500">{errors.returnDate}</p>
                  )}
                </div>
              )}
            </div>

            {/* Locations */}
            <div className="mb-6">
              <div className="mb-4">
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
              
              <div className="mb-4">
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
            </div>

            {/* Next Button */}
            <div className="flex justify-end">
              <Button 
                type="button"
                onClick={handleNextStep}
                className="bg-primary hover:bg-primary-600 text-white px-6 py-2 rounded font-medium"
              >
                Continue
                <i className="ri-arrow-right-line ml-2"></i>
              </Button>
            </div>
          </div>
        )}
        
        {/* Step 2: Bus Options */}
        {currentStep === 2 && (
          <div className="step-content">
            {/* Standard Bus Card - Display Only */}
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h4 className="font-medium text-lg mb-2">Standard Charter Bus</h4>
              <p className="text-gray-700">Comfortable seating for up to 56 passengers with essential amenities.</p>
              
              {/* Hidden input to always set standard bus type */}
              <input 
                type="hidden" 
                name="busType" 
                value="standard" 
                onChange={() => { /* No-op */ }}
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousStep}
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded font-medium"
              >
                <i className="ri-arrow-left-line mr-2"></i>
                Back
              </Button>
              <Button
                onClick={handleGetQuote}
                disabled={isPending}
                className="bg-primary hover:bg-primary-600 text-white px-6 py-2 rounded font-medium"
              >
                {isPending ? (
                  <>
                    <span className="animate-spin mr-2">&#9696;</span>
                    Processing...
                  </>
                ) : (
                  <>
                    Get Your Quote
                    <i className="ri-arrow-right-line ml-2"></i>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
        
        {/* Step 3: Quote Summary */}
        {currentStep === 3 && quoteData && (
          <div className="step-content">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-3">
                <i className="ri-check-line text-green-600 text-xl"></i>
              </div>
              <h3 className="font-heading font-semibold text-lg text-gray-800">Your Quote Summary</h3>
              <p className="text-gray-600 text-sm">Here's a breakdown of your estimated charter bus price</p>
            </div>

            {/* Trip Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-start mb-2">
                    <i className="ri-map-pin-line text-primary mt-1 mr-2"></i>
                    <div>
                      <div className="text-xs text-gray-500">Pickup Location</div>
                      <div className="text-gray-800">
                        {quoteData.tripDetails.pickupLocation.formattedAddress}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start mb-2">
                    <i className="ri-map-pin-line text-primary mt-1 mr-2"></i>
                    <div>
                      <div className="text-xs text-gray-500">Dropoff Location</div>
                      <div className="text-gray-800">
                        {quoteData.tripDetails.dropoffLocation.formattedAddress}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <i className="ri-calendar-line text-primary mt-1 mr-2"></i>
                    <div>
                      <div className="text-xs text-gray-500">Date & Time</div>
                      <div className="text-gray-800">
                        {formatDateTime(quoteData.tripDetails.departureDate, quoteData.tripDetails.departureTime)}
                        {quoteData.tripDetails.tripType === "roundTrip" && quoteData.tripDetails.returnDate && (
                          <> (Return: {formatDateTime(quoteData.tripDetails.returnDate)})</>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start mb-2">
                    <i className="ri-user-line text-primary mt-1 mr-2"></i>
                    <div>
                      <div className="text-xs text-gray-500">Passengers</div>
                      <div className="text-gray-800">
                        {quoteData.tripDetails.numPassengers}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start mb-2">
                    <i className="ri-bus-line text-primary mt-1 mr-2"></i>
                    <div>
                      <div className="text-xs text-gray-500">Bus Type</div>
                      <div className="text-gray-800">
                        {formatBusType(quoteData.tripDetails.busType)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <i className="ri-settings-line text-primary mt-1 mr-2"></i>
                    <div>
                      <div className="text-xs text-gray-500">Amenities</div>
                      <div className="text-gray-800">
                        {formatAmenities(quoteData.tripDetails.amenities || [])}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote Breakdown */}
            <div className="bg-white border border-gray-200 rounded-lg mb-4">
              <div className="border-b border-gray-200 py-3 px-4">
                <h4 className="font-medium text-gray-800">Quote Breakdown</h4>
              </div>
              <div>
                {quoteData.breakdown.map((item, index) => (
                  <div key={index} className="py-3 px-4 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-800">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                      <div className="text-gray-700">
                        {item.multiplier ? (
                          <>x{item.multiplier}</>
                        ) : (
                          <>{formatCurrency(item.amount)}</>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="py-3 px-4 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-800">Service Fee</div>
                      <div className="text-xs text-gray-500">Administrative and service fees</div>
                    </div>
                    <div className="text-gray-700">{formatCurrency(quoteData.serviceFee)}</div>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 bg-gray-50 py-4 px-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-gray-800">Total Estimated Price</div>
                  <div className="font-bold text-xl text-primary-700">
                    {formatCurrency(quoteData.total)}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Final price may vary based on actual trip duration and additional services
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={handlePreviousStep}
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded font-medium"
              >
                <i className="ri-arrow-left-line mr-2"></i>
                Modify Quote
              </Button>
              <Button
                onClick={() => window.location.href = `mailto:bookings@example.com?subject=Charter Bus Quote ${quoteData.quoteId}&body=I would like to book the charter bus quote with ID: ${quoteData.quoteId}`}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-medium"
              >
                Request Booking
                <i className="ri-arrow-right-line ml-2"></i>
              </Button>
            </div>
          </div>
        )}
      </form>
      
      {/* Loading Overlay */}
      {isPending && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-700 font-medium">Calculating your quote...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharterBusQuoteWidget;