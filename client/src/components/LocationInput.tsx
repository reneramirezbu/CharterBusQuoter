import React, { useEffect, useRef, useState } from "react";
import { Location } from "@shared/schema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface LocationInputProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  required?: boolean;
  onChange: (location: Location) => void;
  error?: string;
}

const LocationInput: React.FC<LocationInputProps> = ({
  id,
  label,
  placeholder,
  value,
  required = false,
  onChange,
  error
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [formattedAddress, setFormattedAddress] = useState<string>("");
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [apiLoaded, setApiLoaded] = useState<boolean>(false);

  // Check for Google Maps API loading status
  useEffect(() => {
    const checkGoogleMapsLoaded = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        setApiLoaded(true);
        return true;
      }
      return false;
    };

    // If already loaded
    if (checkGoogleMapsLoaded()) return;

    // Poll for API loading
    const interval = setInterval(() => {
      if (checkGoogleMapsLoaded()) {
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  // Initialize autocomplete once API is loaded and input is available
  useEffect(() => {
    if (!apiLoaded || !inputRef.current) return;

    // Initialize Google Places Autocomplete
    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      fields: ['place_id', 'formatted_address', 'geometry'],
    });

    // Add listener for place changed
    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      
      if (place && place.place_id) {
        const location: Location = {
          placeId: place.place_id,
          formattedAddress: place.formatted_address || "",
          addressInput: inputRef.current?.value || "",
          lat: place.geometry?.location?.lat(),
          lng: place.geometry?.location?.lng()
        };
        
        onChange(location);
        setFormattedAddress(place.formatted_address || "");
        setShowPreview(true);
      }
    });

    return () => {
      // Cleanup Google Maps event listeners
      if (autocompleteRef.current && window.google) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [apiLoaded, onChange]);

  return (
    <div className="mb-4">
      <Label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</Label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <i className="ri-map-pin-line text-gray-400"></i>
        </div>
        <Input
          id={id}
          ref={inputRef}
          type="text"
          placeholder={apiLoaded ? placeholder : "Loading location service..."}
          className={`pl-10 ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
          value={value}
          onChange={(e) => {
            // Only update the input value
            if (e.target.value === "") {
              setShowPreview(false);
              onChange({
                placeId: "",
                formattedAddress: "",
                addressInput: ""
              });
            }
          }}
          required={required}
          disabled={!apiLoaded}
        />
      </div>
      
      {!apiLoaded && (
        <p className="mt-1 text-xs text-amber-500">
          <i className="ri-loader-2-line animate-spin inline-block mr-1"></i>
          Loading Google Maps service...
        </p>
      )}
      
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
      
      {showPreview && formattedAddress && (
        <div className="location-preview">
          <div className="flex items-start">
            <i className="ri-map-pin-fill text-primary mt-1 mr-2"></i>
            <span className="text-gray-700">{formattedAddress}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationInput;
