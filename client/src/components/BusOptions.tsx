import React from "react";
import { Button } from "@/components/ui/button";
import { QuoteRequest } from "@shared/schema";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
  // Always set to standard bus type on component mount
  React.useEffect(() => {
    setFormData(prev => ({ ...prev, busType: "standard", amenities: [] }));
  }, [setFormData]);
  
  const handleSpecialRequirementsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, specialRequirements: e.target.value }));
  };
  
  return (
    <div className="form-section" id="step-2">
      <h3 className="font-heading font-semibold text-xl mb-4 text-gray-800">Bus Options</h3>
      
      {/* Standard Bus Card - Display Only */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <h4 className="font-medium text-lg mb-2">Standard Charter Bus</h4>
        <p className="text-gray-700">Comfortable seating for up to 56 passengers with essential amenities.</p>
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
