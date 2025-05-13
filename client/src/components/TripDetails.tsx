import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatDateForInput, getNextWeekDate } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import LocationInput from "./LocationInput";
import { QuoteRequest, Location } from "@shared/schema";
import { Label } from "@/components/ui/label";
import { CheckboxItem } from "./ui/checkbox-item";

interface TripDetailsProps {
  onNext: () => void;
  formData: QuoteRequest;
  setFormData: React.Dispatch<React.SetStateAction<QuoteRequest>>;
  errors: Record<string, string>;
}

const TripDetails: React.FC<TripDetailsProps> = ({ onNext, formData, setFormData, errors }) => {
  const [minDate, setMinDate] = useState<string>(formatDateForInput(getNextWeekDate()));
  
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
  
  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };
  
  // Check if the form is valid
  const isFormValid = () => {
    if (formData.tripType === "roundTrip" && !formData.returnDate) return false;
    return (
      formData.numPassengers > 0 &&
      formData.departureDate &&
      formData.departureTime &&
      formData.pickupLocation.placeId &&
      formData.dropoffLocation.placeId
    );
  };
  
  return (
    <div className="form-section active" id="step-1">
      <h3 className="font-heading font-semibold text-xl mb-4 text-gray-800">Trip Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Trip Type */}
        <div>
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
        <div>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Departure Date */}
        <div>
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
        <div>
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
          <div id="returnDateContainer">
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

      {/* Location Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-800">Location Details</h4>
          <span className="text-xs text-gray-500">All fields are required</span>
        </div>
        
        {/* Pickup Location */}
        <LocationInput
          id="pickupLocation"
          label="Pickup Location"
          placeholder="Enter pickup address"
          value={formData.pickupLocation?.addressInput || ""}
          onChange={handlePickupLocationChange}
          error={errors.pickupLocation}
          required
        />

        {/* Dropoff Location */}
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

      <div className="flex justify-end">
        <Button 
          type="button"
          onClick={handleContinue}
          disabled={!isFormValid()}
          className="bg-primary hover:bg-primary-600 text-white px-6 py-2 rounded font-medium flex items-center justify-center transition-colors"
        >
          Continue to Bus Options
          <i className="ri-arrow-right-line ml-2"></i>
        </Button>
      </div>
    </div>
  );
};

export default TripDetails;
