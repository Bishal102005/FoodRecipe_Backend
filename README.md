# Food Recipe Backend

This is the backend for the Food Recipe application, built with Node.js, Express, and MongoDB.

## Features

- User Authentication (JWT)
- Recipe Management (Create, Read, Update, Delete)
- Image Uploads via Cloudinary
- CORS enabled for frontend integration

## Prerequisites

- Node.js installed
- MongoDB (Local or Atlas)
- Cloudinary Account (for image uploads)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and fill in your credentials.
4. Run the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /register` - User registration
- `POST /login` - User login
- `GET /recipe` - Fetch all recipes
- `POST /recipe/add` - Add a new recipe
- ... (and more)

## License

ISC