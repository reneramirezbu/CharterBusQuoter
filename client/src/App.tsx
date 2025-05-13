import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";

// Simplified App component - just render the quote form directly with no routing
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <div className="container mx-auto p-4">
        <Home />
      </div>
    </QueryClientProvider>
  );
}

export default App;
