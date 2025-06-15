import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <Box sx={{ mt: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h2" color="primary" gutterBottom>404</Typography>
      <Typography variant="h5" gutterBottom>Page Not Found</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>The page you are looking for does not exist.</Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/')}>Go to Dashboard</Button>
    </Box>
  );
}
