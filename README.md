# Charter Bus Quote Widget

A lightweight, embeddable widget for collecting charter bus quote requests directly on your website, including WordPress sites with Elementor.

## Features

- Standalone widget with minimal dependencies
- Google Maps Places Autocomplete integration for location inputs
- Step-by-step form with validation
- Responsive design that works on mobile, tablet, and desktop
- Easy to embed in any website, including WordPress with Elementor

## Embedding Options

### Option 1: Direct Embedding (Simplest)

1. Copy the entire contents of `public/elementor-code-snippet.html` 
2. In Elementor, add an HTML element to your page
3. Paste the code into the HTML element
4. Replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual Google Maps API key
5. Save and publish your page

This is the simplest option as it includes all HTML, CSS, and JavaScript in a single, self-contained file.

### Option 2: Using the Embed Script (Advanced)

For more advanced integration where you want the widget to load dynamically:

1. Upload `embed.js` to your website
2. Add the following code to your site where you want the widget to appear:

```html
<div id="charter-bus-quote-widget" data-api-url="https://your-api-server.com"></div>
<script src="path/to/embed.js"></script>
```

3. Replace `https://your-api-server.com` with the URL where your widget API is hosted

## Server Setup

The widget requires a server component to generate quotes. Use the following environment variables:

- `VITE_GOOGLE_MAPS_API_KEY`: Your Google Maps API key (for Places Autocomplete)
- `ALLOWED_ORIGINS`: Comma-separated list of domains allowed to access the API (for CORS)

## API Endpoints

The widget API provides the following endpoints:

- `POST /api/quotes`: Generate a new quote
- `GET /api/quotes/:quoteId`: Retrieve a previously generated quote
- `GET /api/google-maps-key`: Retrieve the Google Maps API key

## Development

To start the development server:

```
npm run dev
```

## Customization

The widget styles can be customized to match your brand. The main CSS files are:

- `public/quote-widget.css`: Main widget styles
- `public/widget-styles.css`: Additional styles for embedding

## WordPress CSS Wrapping

When integrating with WordPress, you may need to adjust the CSS selectors to account for WordPress's own CSS. The widget is designed to be encapsulated within the `.charter-quote-widget` class to minimize conflicts.