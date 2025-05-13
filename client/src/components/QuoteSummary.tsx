import React from "react";
import { Button } from "@/components/ui/button";
import { QuoteResponse } from "@shared/schema";
import { formatCurrency, formatDateTime, formatAmenities, formatBusType } from "@/lib/utils";

interface QuoteSummaryProps {
  onBack: () => void;
  quoteData: QuoteResponse | null;
}

const QuoteSummary: React.FC<QuoteSummaryProps> = ({ onBack, quoteData }) => {
  if (!quoteData) return null;
  
  const { tripDetails, breakdown, subtotal, serviceFee, total } = quoteData;
  
  const handleProceedToBooking = () => {
    alert("This would proceed to the booking page in a complete application.");
  };
  
  return (
    <div className="form-section" id="step-3">
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-3">
          <i className="ri-check-line text-green-600 text-2xl"></i>
        </div>
        <h3 className="font-heading font-semibold text-xl text-gray-800">Your Quote Summary</h3>
        <p className="text-gray-600 text-sm">Here's a breakdown of your estimated charter bus price</p>
      </div>

      {/* Trip Summary Card */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-gray-800 mb-3">Trip Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-start mb-2">
              <i className="ri-map-pin-line text-primary mt-1 mr-2"></i>
              <div>
                <div className="text-xs text-gray-500">Pickup Location</div>
                <div id="summaryPickup" className="text-gray-800">
                  {tripDetails.pickupLocation.formattedAddress}
                </div>
              </div>
            </div>
            <div className="flex items-start mb-2">
              <i className="ri-map-pin-line text-primary mt-1 mr-2"></i>
              <div>
                <div className="text-xs text-gray-500">Dropoff Location</div>
                <div id="summaryDropoff" className="text-gray-800">
                  {tripDetails.dropoffLocation.formattedAddress}
                </div>
              </div>
            </div>
            <div className="flex items-start">
              <i className="ri-calendar-line text-primary mt-1 mr-2"></i>
              <div>
                <div className="text-xs text-gray-500">Date & Time</div>
                <div id="summaryDateTime" className="text-gray-800">
                  {formatDateTime(tripDetails.departureDate, tripDetails.departureTime)}
                  {tripDetails.tripType === "roundTrip" && tripDetails.returnDate && (
                    <> (Return: {formatDateTime(tripDetails.returnDate)})</>
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
                <div id="summaryPassengers" className="text-gray-800">
                  {tripDetails.numPassengers}
                </div>
              </div>
            </div>
            <div className="flex items-start mb-2">
              <i className="ri-bus-line text-primary mt-1 mr-2"></i>
              <div>
                <div className="text-xs text-gray-500">Bus Type</div>
                <div id="summaryBusType" className="text-gray-800">
                  {formatBusType(tripDetails.busType)}
                </div>
              </div>
            </div>
            <div className="flex items-start">
              <i className="ri-settings-line text-primary mt-1 mr-2"></i>
              <div>
                <div className="text-xs text-gray-500">Amenities</div>
                <div id="summaryAmenities" className="text-gray-800">
                  {formatAmenities(tripDetails.amenities || [])}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Breakdown */}
      <div className="bg-white border border-gray-200 rounded-lg mb-6">
        <div className="border-b border-gray-200 py-3 px-4">
          <h4 className="font-medium text-gray-800">Quote Breakdown</h4>
        </div>
        <div id="quoteBreakdownItems">
          {breakdown.map((item, index) => (
            <div key={index} className="quote-breakdown-item py-3 px-4">
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
          <div className="quote-breakdown-item py-3 px-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-gray-800">Service Fee</div>
                <div className="text-xs text-gray-500">Administrative and service fees</div>
              </div>
              <div className="text-gray-700">{formatCurrency(serviceFee)}</div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 bg-gray-50 py-4 px-4">
          <div className="flex items-center justify-between">
            <div className="font-medium text-gray-800">Total Estimated Price</div>
            <div className="font-bold text-xl text-primary-700" id="quoteTotalPrice">
              {formatCurrency(total)}
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
          onClick={onBack}
          className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded font-medium flex items-center justify-center transition-colors"
        >
          <i className="ri-arrow-left-line mr-2"></i>
          Modify Quote
        </Button>
        <Button
          onClick={handleProceedToBooking}
          className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-6 py-3 rounded font-medium flex items-center justify-center transition-colors"
        >
          Proceed to Booking
          <i className="ri-arrow-right-line ml-2"></i>
        </Button>
      </div>
    </div>
  );
};

export default QuoteSummary;
