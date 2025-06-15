import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon, ErrorOutline as ErrorIcon } from '@mui/icons-material';
import { 
  ModernButton, 
  modernBlue, 
  gradients, 
  responsiveTypography 
} from '../theme/modernDesign';

const NotFoundContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  background: `radial-gradient(circle at 50% 50%, ${modernBlue.primary}10, transparent 70%)`,
}));

const ErrorNumber = styled(Typography)(({ theme }) => ({
  ...responsiveTypography.hero,
  fontSize: '8rem',
  fontWeight: 800,
  background: gradients.primary,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    fontSize: '4rem',
  }
}));

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <NotFoundContainer maxWidth="sm">
      <ErrorIcon sx={{ fontSize: '6rem', color: modernBlue.primary, mb: 2, opacity: 0.3 }} />
      <ErrorNumber>404</ErrorNumber>
      <Typography variant="h4" sx={{ ...responsiveTypography.title, mb: 2 }}>
        Oops! Page Not Found
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4, maxWidth: 400 }}>
        The page you're looking for seems to have wandered off. Let's get you back to your wardrobe!
      </Typography>
      <ModernButton
        variant="primary"
        onClick={() => navigate('/')}
        startIcon={<HomeIcon />}
        size="large"
      >
        Back to Dashboard
      </ModernButton>
    </NotFoundContainer>
  );
}
