declare namespace google {
  namespace maps {
    namespace places {
      class Autocomplete {
        constructor(inputField: HTMLInputElement, options?: AutocompleteOptions);
        addListener(eventName: string, handler: Function): void;
        getPlace(): PlaceResult;
      }
      
      interface AutocompleteOptions {
        types?: string[];
        fields?: string[];
        componentRestrictions?: {
          country: string | string[];
        };
      }
      
      interface PlaceResult {
        place_id?: string;
        formatted_address?: string;
        geometry?: {
          location?: {
            lat(): number;
            lng(): number;
          };
        };
      }
    }
    
    namespace event {
      function clearInstanceListeners(instance: any): void;
    }
  }
}

// Extend the Window interface
interface Window {
  google?: typeof google;
}