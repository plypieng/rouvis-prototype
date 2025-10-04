# LocalFarm AI - Web Application

A professional-quality desktop web application aimed at strategic farm planning, AI-driven crop area optimization, detailed analytics, and community interaction for Niigata, Japan-based farmers.

## Features

- **Dashboard**: Farm analytics with yield charts, weather forecasts, and sensor data visualizations
- **Generative AI Crop Layout Planner**: Interactive Google Maps integration for optimized crop planting suggestions
- **Advanced Crop Scheduling Calendar**: Interactive drag-and-drop calendar with AI-assisted scheduling
- **Detailed Historical Data & Analytics**: Crop yield histories, input cost vs. revenue analysis with interactive charts
- **Rich Community Knowledge Base**: Archive of veteran farmer knowledge, searchable articles, and tips
- **Full-featured AI Chat Interface**: GPT-powered detailed conversation for strategic farming advice

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI**: Tailwind CSS + Shadcn/UI components
- **Backend/API**: Shared serverless backend (localfarm-backend)
- **Data Visualization**: Recharts library for interactive charts
- **Map Integration**: Google Maps API

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Set up environment variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Usage

The web application is designed for desktop use, providing strategic planning tools:

- View comprehensive farm analytics dashboard with yield and profit insights
- Plan crop layouts with AI-optimized suggestions using the interactive map
- Schedule farming activities with the intelligent calendar system
- Analyze historical data to make informed decisions
- Access the knowledge base for expert farming wisdom
- Use the strategic AI assistant for in-depth agricultural planning

## Deployment

The application is designed to be deployed on Vercel:

```bash
vercel
```

Or use the Vercel dashboard to connect your GitHub repository for continuous deployment.

## Backend Integration

This web app integrates with the `localfarm-backend` API. Make sure the backend is running and properly configured for full functionality.

## Note on Map Features

To use the crop layout planner with Google Maps, you'll need to provide a valid Google Maps API key in your environment variables. For development purposes, the application includes mock data that shows the functionality without requiring an actual API key.
