import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';

import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import ClothingList from './components/Clothing/ClothingList';
import OutfitList from './components/Outfits/OutfitList';
import OutfitHistory from './components/Outfits/OutfitHistory';
import Analytics from './components/Analytics/Analytics';
import Dashboard from './components/Dashboard/Dashboard';
import Profile from './components/Profile/Profile';
import Navbar from './components/Navigation/Navbar';
import NotFound from './components/NotFound';
import CreateOutfitForm from './components/Outfits/CreateOutfitForm';
import AddClothingForm from './components/Clothing/AddClothingForm';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <MainRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

function MainRoutes() {
  const { user, loading } = useAuth();
  // Get current path
  const path = window.location.pathname;
  // Show Navbar on all pages except login and register
  const showNavbar = path !== '/login' && path !== '/register';

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/clothes" element={<ProtectedRoute><ClothingList /></ProtectedRoute>} />
        <Route path='add-clothing' element={<ProtectedRoute><AddClothingForm /></ProtectedRoute>} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/outfits" element={<ProtectedRoute><OutfitList /></ProtectedRoute>} />
        <Route path="/outfit-history" element={<ProtectedRoute><OutfitHistory /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/create-outfit" element={<ProtectedRoute><CreateOutfitForm /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
}

export default App;