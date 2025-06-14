# Dressing Organizer Backend

This is the backend server for the Dressing Organizer application. It provides APIs for managing clothing items and outfits.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dressing_organizer
NODE_ENV=development
```

3. Create an `uploads` directory in the root folder for storing images:
```bash
mkdir uploads
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Clothing Items

- `GET /api/clothing-items` - Get all clothing items
- `GET /api/clothing-items/:id` - Get a specific clothing item
- `POST /api/clothing-items` - Create a new clothing item
- `PATCH /api/clothing-items/:id` - Update a clothing item
- `DELETE /api/clothing-items/:id` - Delete a clothing item
- `PATCH /api/clothing-items/:id/last-worn` - Update last worn date

### Outfits

- `GET /api/outfits` - Get all outfits
- `GET /api/outfits/:id` - Get a specific outfit
- `POST /api/outfits` - Create a new outfit
- `PATCH /api/outfits/:id` - Update an outfit
- `DELETE /api/outfits/:id` - Delete an outfit
- `PATCH /api/outfits/:id/last-worn` - Update last worn date
- `GET /api/outfits/occasion/:occasion` - Get outfits by occasion
- `GET /api/outfits/season/:season` - Get outfits by season

## Data Models

### ClothingItem
- name (String, required)
- type (String, required)
- category (String, required)
- color (String, required)
- season (String, required)
- brand (String)
- size (String)
- condition (String, enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'])
- purchaseDate (Date)
- price (Number)
- notes (String)
- image (String)
- lastWorn (Date)

### Outfit
- name (String, required)
- items (Array of ClothingItem references, required)
- occasion (String, required)
- weather (String, required)
- season (String, required)
- style (String)
- notes (String)
- image (String)
- lastWorn (Date)
- rating (Number, min: 1, max: 5) 