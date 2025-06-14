# Dressing Organizer

A full-stack web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that helps users organize their wardrobe and create outfits.

## Features

- User authentication and authorization
- Upload and manage clothing items
- Create and save outfits
- AI-powered outfit suggestions
- Filter and search functionality
- Responsive design

## Tech Stack

- **Frontend**: React.js, CSS3
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/dressing-organizer.git
cd dressing-organizer
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

5. Create a `.env` file in the frontend directory:
```
REACT_APP_API_URL=http://localhost:5000
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## Test Users

You can use these test accounts to login:
- Email: user@example.com, Password: password123
- Email: test@test.com, Password: test123

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
