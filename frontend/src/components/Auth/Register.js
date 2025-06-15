import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Box, 
  Alert,
  Grid,
  Paper,
  Divider,
  Chip,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  modernBlue, 
  gradients, 
  ModernCard, 
  ModernButton, 
  modernTypography,
  createGlassmorphismBg,
  responsiveGrid
} from '../../theme/modernDesign';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import StyleIcon from '@mui/icons-material/Style';
import HeightIcon from '@mui/icons-material/Height';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import StraightenIcon from '@mui/icons-material/Straighten';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import LoginIcon from '@mui/icons-material/Login';
import axios from 'axios';

// Styled Components
const RegisterContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: theme.palette.mode === 'dark'
    ? 'radial-gradient(circle at 20% 50%, rgba(79, 70, 229, 0.1), transparent 50%), radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.1), transparent 50%)'
    : 'radial-gradient(circle at 20% 50%, rgba(79, 70, 229, 0.05), transparent 50%), radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.05), transparent 50%)',
  position: 'relative',
  padding: theme.spacing(2),
}));

const RegisterCard = styled(ModernCard)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 600,
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
  background: gradients.secondary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 24px auto',
  boxShadow: `0 12px 32px ${modernBlue.secondary}30`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: `0 16px 40px ${modernBlue.secondary}40`,
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

const SectionCard = styled(Paper)(({ theme }) => ({
  ...createGlassmorphismBg(theme, 0.7),
  padding: theme.spacing(3),
  borderRadius: 20,
  marginBottom: theme.spacing(3),
  border: `1px solid ${theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.05)'}`,
}));

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    stylePreferences: '', // comma separated
    measurements: {
      height: '',
      weight: '',
      bust: '',
      waist: '',
      hips: ''
    }
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (Object.keys(formData.measurements).includes(name)) {
      setFormData({ ...formData, measurements: { ...formData.measurements, [name]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (error) setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        stylePreferences: formData.stylePreferences.split(',').map(s => s.trim()).filter(Boolean),
        measurements: {
          height: Number(formData.measurements.height) || undefined,
          weight: Number(formData.measurements.weight) || undefined,
          bust: Number(formData.measurements.bust) || undefined,
          waist: Number(formData.measurements.waist) || undefined,
          hips: Number(formData.measurements.hips) || undefined
        }
      };
      
      await axios.post('http://localhost:5000/api/auth/register', payload);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
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
          Create Account
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
          Join us to organize your wardrobe smartly
        </Typography>

        {/* Alerts */}
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
        
        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3,
              borderRadius: 3,
              ...createGlassmorphismBg({ palette: { mode: 'light' } }),
              border: '1px solid rgba(16, 185, 129, 0.2)',
            }}
          >
            {success}
          </Alert>
        )}

        {/* Registration Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', textAlign: 'left' }}>
          {/* Basic Information */}
          <SectionCard>
            <Typography 
              variant="h6" 
              sx={{ 
                ...modernTypography.heading,
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <PersonIcon sx={{ color: modernBlue.primary }} />
              Basic Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <ModernTextField
                  required
                  fullWidth
                  label="Full Name"
                  name="name"
                  autoFocus
                  value={formData.name}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: modernBlue.primary, fontSize: '1.2rem' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <ModernTextField
                  required
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: modernBlue.primary, fontSize: '1.2rem' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <ModernTextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: modernBlue.primary, fontSize: '1.2rem' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </SectionCard>

          {/* Style Preferences */}
          <SectionCard>
            <Typography 
              variant="h6" 
              sx={{ 
                ...modernTypography.heading,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <StyleIcon sx={{ color: modernBlue.secondary }} />
              Style Preferences
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Tell us about your style preferences (e.g., casual, formal, minimalist, vintage)
            </Typography>
            
            <ModernTextField
              fullWidth
              name="stylePreferences"
              label="Style Preferences (comma separated)"
              placeholder="casual, minimalist, modern, comfortable"
              value={formData.stylePreferences}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <StyleIcon sx={{ color: modernBlue.secondary, fontSize: '1.2rem' }} />
                  </InputAdornment>
                ),
              }}
            />
          </SectionCard>

          {/* Measurements */}
          <SectionCard>
            <Typography 
              variant="h6" 
              sx={{ 
                ...modernTypography.heading,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <StraightenIcon sx={{ color: modernBlue.accent }} />
              Measurements (Optional)
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Help us provide better size recommendations
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item {...responsiveGrid.tablet}>
                <ModernTextField
                  fullWidth
                  name="height"
                  label="Height (cm)"
                  type="number"
                  value={formData.measurements.height}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HeightIcon sx={{ color: modernBlue.accent, fontSize: '1.2rem' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item {...responsiveGrid.tablet}>
                <ModernTextField
                  fullWidth
                  name="weight"
                  label="Weight (kg)"
                  type="number"
                  value={formData.measurements.weight}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FitnessCenterIcon sx={{ color: modernBlue.accent, fontSize: '1.2rem' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item {...responsiveGrid.desktop}>
                <ModernTextField
                  fullWidth
                  name="bust"
                  label="Bust (cm)"
                  type="number"
                  value={formData.measurements.bust}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <StraightenIcon sx={{ color: modernBlue.accent, fontSize: '1.2rem' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item {...responsiveGrid.desktop}>
                <ModernTextField
                  fullWidth
                  name="waist"
                  label="Waist (cm)"
                  type="number"
                  value={formData.measurements.waist}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <StraightenIcon sx={{ color: modernBlue.accent, fontSize: '1.2rem' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item {...responsiveGrid.desktop}>
                <ModernTextField
                  fullWidth
                  name="hips"
                  label="Hips (cm)"
                  type="number"
                  value={formData.measurements.hips}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <StraightenIcon sx={{ color: modernBlue.accent, fontSize: '1.2rem' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </SectionCard>

          {/* Submit Button */}
          <ModernButton
            type="submit"
            fullWidth
            variant="secondary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AppRegistrationIcon />}
            sx={{ 
              mt: 2, 
              mb: 3,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
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
            Already have an account?
          </Typography>
        </Divider>

        {/* Login Link */}
        <Button
          fullWidth
          variant="outlined"
          onClick={() => navigate('/login')}
          startIcon={<LoginIcon />}
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
          Sign In to Existing Account
        </Button>
      </RegisterCard>
    </RegisterContainer>
  );
}

export default Register;