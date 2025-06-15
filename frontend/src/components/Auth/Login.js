import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Divider,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  modernBlue, 
  gradients, 
  ModernCard, 
  ModernButton, 
  modernTypography,
  modernContainer,
  shadows,
  createGlassmorphismBg
} from '../../theme/modernDesign';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import axios from 'axios';

// Styled Components
const LoginContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: theme.palette.mode === 'dark'
    ? 'radial-gradient(circle at 20% 50%, rgba(79, 70, 229, 0.1), transparent 50%), radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.1), transparent 50%)'
    : 'radial-gradient(circle at 20% 50%, rgba(79, 70, 229, 0.05), transparent 50%), radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.05), transparent 50%)',
  position: 'relative',
  padding: theme.spacing(2),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: theme.palette.mode === 'dark'
      ? 'radial-gradient(circle at 20% 50%, rgba(79, 70, 229, 0.05), transparent 50%)'
      : 'radial-gradient(circle at 20% 50%, rgba(79, 70, 229, 0.02), transparent 50%)',
    pointerEvents: 'none'
  }
}));

const LoginCard = styled(ModernCard)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 450,
  width: '100%',
  textAlign: 'center',
  position: 'relative',
  zIndex: 1,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
    margin: theme.spacing(2),
  }
}));

const BrandIcon = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  background: gradients.primary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 24px auto',
  boxShadow: `0 12px 32px ${modernBlue.primary}30`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: `0 16px 40px ${modernBlue.primary}40`,
  }
}));

const ModernTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: 16,
    background: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.02)' 
      : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    border: `1px solid ${theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.05)'}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      border: `1px solid ${modernBlue.primary}50`,
      transform: 'translateY(-2px)',
      boxShadow: `0 8px 24px ${modernBlue.primary}20`,
    },
    '&.Mui-focused': {
      border: `1px solid ${modernBlue.primary}`,
      boxShadow: `0 8px 24px ${modernBlue.primary}30`,
    }
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500,
  }
}));

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (error) setError(''); // Clear error on input change
  };

  return (
    <LoginContainer>
      <LoginCard>
        {/* Brand Icon */}
        <BrandIcon>
          <PersonIcon sx={{ fontSize: 40, color: 'white' }} />
        </BrandIcon>

        {/* Title */}
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            ...modernTypography.gradientHeading,
            mb: 1,
            fontSize: { xs: '1.75rem', sm: '2.125rem' }
          }}
        >
          Welcome Back
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ 
            mb: 4,
            fontWeight: 500,
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}
        >
          Sign in to your account to continue
        </Typography>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 3,
              ...createGlassmorphismBg({ palette: { mode: 'light' } }),
              border: '1px solid rgba(239, 68, 68, 0.2)',
            }}
          >
            {error}
          </Alert>
        )}

        {/* Login Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <ModernTextField
            required
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleInputChange('email')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: modernBlue.primary, fontSize: '1.2rem' }} />
                </InputAdornment>
              ),
            }}
          />
          
          <ModernTextField
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={formData.password}
            onChange={handleInputChange('password')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: modernBlue.primary, fontSize: '1.2rem' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: 'text.secondary' }}
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <ModernButton
            type="submit"
            fullWidth
            variant="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
            sx={{ 
              mt: 2, 
              mb: 3,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </ModernButton>
        </Box>

        {/* Divider */}
        <Divider sx={{ 
          my: 3,
          '&::before, &::after': {
            borderColor: theme => theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(0, 0, 0, 0.1)'
          }
        }}>
          <Typography variant="body2" color="text.secondary" sx={{ px: 2, fontWeight: 500 }}>
            Don't have an account?
          </Typography>
        </Divider>

        {/* Register Link */}
        <Button
          fullWidth
          variant="outlined"
          onClick={() => navigate('/register')}
          startIcon={<AppRegistrationIcon />}
          sx={{
            borderRadius: 3,
            py: 1.5,
            fontWeight: 600,
            textTransform: 'none',
            borderColor: modernBlue.primary,
            color: modernBlue.primary,
            '&:hover': {
              borderColor: modernBlue.primaryDark,
              backgroundColor: `${modernBlue.primary}10`,
              transform: 'translateY(-2px)',
              boxShadow: `0 8px 24px ${modernBlue.primary}20`,
            }
          }}
        >
          Create New Account
        </Button>
      </LoginCard>
    </LoginContainer>
  );
}

export default Login;