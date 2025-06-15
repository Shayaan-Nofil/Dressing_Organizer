import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Dressing Organizer
        </Typography>
        <Box>
          {isAuthenticated ? (
            <>
              <Button color={location.pathname === '/outfits' ? 'secondary' : 'inherit'} onClick={() => navigate('/outfits')}>Outfits</Button>
              <Button color={location.pathname === '/ai-features' ? 'secondary' : 'inherit'} onClick={() => navigate('/ai-features')}>AI Features</Button>
              <Button color={location.pathname === '/clothes' ? 'secondary' : 'inherit'} onClick={() => navigate('/clothes')}>My Clothes</Button>
              <Button color={location.pathname === '/analytics' ? 'secondary' : 'inherit'} onClick={() => navigate('/analytics')}>Analytics</Button>
              <Button color={location.pathname === '/privacy' ? 'secondary' : 'inherit'} onClick={() => navigate('/privacy')}>Privacy</Button>
              <Button color={location.pathname === '/profile' ? 'secondary' : 'inherit'} onClick={() => navigate('/profile')}>Profile</Button>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button color={location.pathname === '/login' ? 'secondary' : 'inherit'} onClick={() => navigate('/login')}>Login</Button>
              <Button color={location.pathname === '/register' ? 'secondary' : 'inherit'} onClick={() => navigate('/register')}>Register</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;