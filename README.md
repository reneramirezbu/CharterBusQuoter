# Charter Bus Quote Application

A modern, full-stack application for obtaining charter bus quotes. This project includes Google Maps Places API integration for location autocomplete, a multi-step form process, and a clean UI based on best practices.

## Features

- Google Maps Places API for address autocomplete
- Multi-step quote form with intuitive navigation
- Real-time quote calculation
- Responsive design that works on all devices
- Clear visual feedback for user interactions
- Proper form validation on both client and server
- Clean, modular code structure

## Prerequisites

- Node.js 16+
- A Google Maps API key with Places API enabled

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example` and add your Google Maps API key:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```
4. Start the development server:
   ```
   npm run dev
   ```
5. Visit http://localhost:5000 in your browser

## Project Structure

This project follows a full-stack structure with React/TypeScript on the frontend and Node.js/Express on the backend.

### Key Directories and Files

- `client/` - Frontend React application
  - `src/components/` - React components
  - `src/pages/` - Page components
  - `src/lib/` - Utility functions
- `server/` - Backend Express application
  - `controllers/` - API route controllers
  - `services/` - Business logic services
  - `utils/` - Utility functions
- `shared/` - Shared types and schemas used by both frontend and backend

## API Endpoints

- `POST /api/quotes` - Submit a quote request and receive pricing
- `GET /api/quotes/:quoteId` - Retrieve a specific quote by ID

## Setting Up Google Maps API

1. Create a project in the Google Cloud Console
2. Enable the Places API
3. Create an API key with appropriate restrictions
4. Add the API key to your `.env` file

## Styling and Customization

The application uses [Tailwind CSS](https://tailwindcss.com/) for styling and [Shadcn UI](https://ui.shadcn.com/) for components. The color scheme and visual elements can be customized in:

- `tailwind.config.ts` - For theme colors and design tokens
- `client/src/index.css` - For global styles and CSS variables

## License

MIT
