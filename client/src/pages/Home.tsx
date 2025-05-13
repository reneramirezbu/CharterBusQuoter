import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { QuoteRequest, QuoteResponse } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

import ProgressSteps from "@/components/ProgressSteps";
import TripDetails from "@/components/TripDetails";
import BusOptions from "@/components/BusOptions";
import QuoteSummary from "@/components/QuoteSummary";

const defaultQuoteRequest: QuoteRequest = {
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
  busType: "standard",
  amenities: []
};

const Home: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<QuoteRequest>(defaultQuoteRequest);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  
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
  
  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <form id="charterQuoteForm" onSubmit={(e) => e.preventDefault()}>
          {/* Progress Steps */}
          <ProgressSteps currentStep={currentStep} />
          
          {currentStep === 1 && (
            <TripDetails 
              onNext={handleNextStep} 
              formData={formData} 
              setFormData={setFormData}
              errors={errors}
            />
          )}
          
          {currentStep === 2 && (
            <BusOptions 
              onBack={handlePreviousStep} 
              onGetQuote={handleGetQuote}
              formData={formData}
              setFormData={setFormData}
              isPending={isPending}
            />
          )}
          
          {currentStep === 3 && (
            <QuoteSummary 
              onBack={() => setCurrentStep(2)} 
              quoteData={quoteData || null}
            />
          )}
        </form>
      </div>

      {/* Loading Overlay */}
      {isPending && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-700 font-medium">Calculating your quote...</p>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
