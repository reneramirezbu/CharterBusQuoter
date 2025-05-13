import React from "react";
import { Button } from "@/components/ui/button";
import { QuoteRequest } from "@shared/schema";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckboxItem } from "./ui/checkbox-item";

interface BusOptionsProps {
  onBack: () => void;
  onGetQuote: () => void;
  formData: QuoteRequest;
  setFormData: React.Dispatch<React.SetStateAction<QuoteRequest>>;
  isPending: boolean;
}

const BusOptions: React.FC<BusOptionsProps> = ({ 
  onBack, 
  onGetQuote, 
  formData, 
  setFormData,
  isPending
}) => {
  const handleBusTypeChange = (busType: "standard" | "luxury") => {
    setFormData(prev => ({ ...prev, busType }));
  };
  
  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFormData(prev => {
      const currentAmenities = prev.amenities || [];
      
      if (checked) {
        // Add amenity if it doesn't exist
        return { ...prev, amenities: [...currentAmenities, amenity] };
      } else {
        // Remove amenity if it exists
        return { ...prev, amenities: currentAmenities.filter(a => a !== amenity) };
      }
    });
  };
  
  const handleSpecialRequirementsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, specialRequirements: e.target.value }));
  };
  
  return (
    <div className="form-section" id="step-2">
      <h3 className="font-heading font-semibold text-xl mb-4 text-gray-800">Bus Options</h3>
      
      {/* Bus Type Selection */}
      <div className="mb-6">
        <Label className="block text-sm font-medium text-gray-700 mb-3">Select Bus Type</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Standard Bus Option */}
          <CheckboxItem
            type="radio"
            name="busType"
            label="Standard Charter Bus"
            description="Comfortable seating for up to 56 passengers with essential amenities."
            imageSrc="https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
            features={[
              "ri-user-line Up to 56 passengers",
              "ri-wifi-line Basic WiFi",
              "ri-plug-line Power outlets"
            ]}
            checked={formData.busType === "standard"}
            onChange={() => handleBusTypeChange("standard")}
          />

          {/* Luxury Bus Option */}
          <CheckboxItem
            type="radio"
            name="busType"
            label="Luxury Charter Bus"
            description="Premium experience with spacious seating and enhanced amenities."
            imageSrc="https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
            features={[
              "ri-user-line Up to 40 passengers",
              "ri-wifi-line High-speed WiFi",
              "ri-tv-line Entertainment systems",
              "ri-restaurant-line Refreshment options"
            ]}
            checked={formData.busType === "luxury"}
            onChange={() => handleBusTypeChange("luxury")}
          />
        </div>
      </div>

      {/* Additional Amenities */}
      <div className="mb-6">
        <Label className="block text-sm font-medium text-gray-700 mb-3">Additional Amenities</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <CheckboxItem
            name="amenities"
            label="Premium WiFi"
            icon="ri-wifi-line"
            checked={formData.amenities?.includes("wifi")}
            onChange={(e) => handleAmenityChange("wifi", e.target.checked)}
          />
          
          <CheckboxItem
            name="amenities"
            label="Lavatory"
            icon="ri-home-gear-line"
            checked={formData.amenities?.includes("lavatory")}
            onChange={(e) => handleAmenityChange("lavatory", e.target.checked)}
          />
          
          <CheckboxItem
            name="amenities"
            label="Entertainment"
            icon="ri-tv-line"
            checked={formData.amenities?.includes("entertainment")}
            onChange={(e) => handleAmenityChange("entertainment", e.target.checked)}
          />
          
          <CheckboxItem
            name="amenities"
            label="Meal Service"
            icon="ri-restaurant-line"
            checked={formData.amenities?.includes("food")}
            onChange={(e) => handleAmenityChange("food", e.target.checked)}
          />
          
          <CheckboxItem
            name="amenities"
            label="Power Outlets"
            icon="ri-plug-line"
            checked={formData.amenities?.includes("powerOutlets")}
            onChange={(e) => handleAmenityChange("powerOutlets", e.target.checked)}
          />
          
          <CheckboxItem
            name="amenities"
            label="Extra Luggage"
            icon="ri-suitcase-line"
            checked={formData.amenities?.includes("luggage")}
            onChange={(e) => handleAmenityChange("luggage", e.target.checked)}
          />
        </div>
      </div>

      {/* Special Requirements */}
      <div className="mb-6">
        <Label htmlFor="specialRequirements" className="block text-sm font-medium text-gray-700 mb-1">
          Special Requirements (Optional)
        </Label>
        <Textarea
          id="specialRequirements"
          value={formData.specialRequirements || ""}
          onChange={handleSpecialRequirementsChange}
          rows={3}
          placeholder="Any special requirements or requests?"
        />
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded font-medium flex items-center justify-center transition-colors"
        >
          <i className="ri-arrow-left-line mr-2"></i>
          Back
        </Button>
        <Button
          onClick={onGetQuote}
          disabled={isPending}
          className="bg-primary hover:bg-primary-600 text-white px-6 py-2 rounded font-medium flex items-center justify-center transition-colors"
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
  );
};

export default BusOptions;
