# Charter Bus Quote Widget

A lightweight, standalone Charter Bus Quote widget that can be embedded in WordPress sites with Elementor, or any other website.

## Features

- Customizable widget that can be embedded in any website
- Google Places Autocomplete for pickup/drop-off locations
- Form validation with detailed error messages
- Responsive design that works on mobile and desktop
- Step-by-step quote process with live updates
- Real-time pricing calculation
- No dependencies on jQuery or other heavy libraries
- CORS support for cross-domain integration

## Getting Started

### Prerequisites

- Node.js 14+ and npm
- Google Maps JavaScript API key with Places API enabled

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/charter-bus-quote-widget.git
cd charter-bus-quote-widget
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
GOOGLE_API_KEY=your_google_maps_api_key
ALLOWED_ORIGINS=https://your-wordpress-site.com,https://www.your-wordpress-site.com
```

4. Start the server:
```bash
npm run dev
```

## WordPress / Elementor Integration

Follow these steps to embed the widget in your WordPress site using Elementor:

### 1. Upload Widget Files to WordPress

1. Navigate to your WordPress admin panel
2. Go to Media > Add New
3. Upload the following files from the `public` directory:
   - `quote-widget.js`

### 2. Add the Widget to an Elementor Page

1. Edit your page with Elementor
2. Add an HTML widget or Custom Code widget to your page
3. Paste the following code:

```html
<div id="charter-bus-quote-container" 
     data-api-url="https://your-backend-domain.com" 
     data-api-key="YOUR_GOOGLE_MAPS_API_KEY"></div>
<script src="/wp-content/uploads/quote-widget.js"></script>
```

4. Replace `https://your-backend-domain.com` with the URL where your backend API is hosted
5. Replace `YOUR_GOOGLE_MAPS_API_KEY` with your Google Maps API key
6. Update the script src path to match the actual path where your widget JS file is uploaded

### 3. Customize the Widget (Optional)

You can customize the appearance of the widget by adding CSS in the Elementor Custom CSS section:

```css
#charter-bus-quote-container {
  max-width: 800px;
  margin: 0 auto;
}

/* Add any additional styling here */
```

## Usage Without WordPress

You can also use the widget on any website by including the following HTML:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Charter Bus Quote</title>
  <link rel="stylesheet" href="https://your-backend-domain.com/widget-styles.css">
  <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places" 
          async defer></script>
</head>
<body>
  <div id="charter-bus-quote-container" 
       data-api-url="https://your-backend-domain.com"></div>
  <script src="https://your-backend-domain.com/quote-widget.js"></script>
</body>
</html>
```

## API Endpoints

### Generate Quote

```
POST /api/quotes
```

Request body:
```json
{
  "tripType": "oneWay", // or "roundTrip"
  "numPassengers": 30,
  "departureDate": "2025-06-15",
  "departureTime": "09:00",
  "returnDate": "2025-06-16", // only for roundTrip
  "pickupLocation": {
    "placeId": "ChIJv3KvkWtbdkgRF4X5rjJTdkI",
    "formattedAddress": "123 Main St, City, State, ZIP",
    "addressInput": "123 Main St",
    "lat": 40.7128,
    "lng": -74.0060
  },
  "dropoffLocation": {
    "placeId": "ChIJOwg_06VPwokRYv534QaPC8g",
    "formattedAddress": "456 Oak St, City, State, ZIP",
    "addressInput": "456 Oak St",
    "lat": 41.8781,
    "lng": -87.6298
  },
  "busType": "standard", // or "luxury"
  "amenities": ["wifi", "lavatory", "entertainment", "powerOutlets"],
  "specialRequirements": "No special requirements" // optional
}
```

Response:
```json
{
  "quoteId": "550e8400-e29b-41d4-a716-446655440000",
  "tripDetails": { /* Same as request */ },
  "breakdown": [
    {
      "name": "Base Fare",
      "description": "50 miles at 3.25/mile",
      "amount": 162.5
    },
    {
      "name": "Trip Type",
      "description": "One way trip",
      "amount": 0
    },
    {
      "name": "Amenities",
      "description": "wifi, lavatory, entertainment, powerOutlets",
      "amount": 125
    }
  ],
  "subtotal": 287.5,
  "serviceFee": 14.38,
  "total": 301.88,
  "createdAt": "2025-05-13T15:30:00.000Z",
  "expiresAt": "2025-05-14T15:30:00.000Z"
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | The port the server will run on | 5000 |
| GOOGLE_API_KEY | Your Google Maps API key | None (Required) |
| ALLOWED_ORIGINS | Comma-separated list of allowed origins for CORS | * (all origins) |

## License

This project is licensed under the MIT License - see the LICENSE file for details.