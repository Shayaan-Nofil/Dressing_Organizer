import { styled } from '@mui/material/styles';
import { Paper, Button, Card, Box, Avatar } from '@mui/material';

// New Modern Cool Blue Color Palette
export const modernBlue = {
  primary: '#3B82F6', // Modern cool blue
  primaryDark: '#1E40AF',
  primaryLight: '#60A5FA',
  secondary: '#8B5CF6', // Modern purple
  secondaryDark: '#7C3AED',
  secondaryLight: '#A78BFA',
  accent: '#06B6D4', // Modern cyan
  accentDark: '#0891B2',
  success: '#10B981', // Modern emerald
  warning: '#F59E0B', // Modern amber
  error: '#EF4444', // Modern red
  neutral: '#64748B', // Modern slate
  neutralDark: '#475569',
  neutralLight: '#94A3B8',
};

// Glassmorphism Background Generator
export const createGlassmorphismBg = (theme, opacity = 0.9) => ({
  backgroundColor: theme.palette.mode === 'dark' 
    ? `rgba(255, 255, 255, ${opacity * 0.02})` 
    : `rgba(255, 255, 255, ${opacity})`,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.05)'}`,
});

// Modern Shadow System
export const shadows = {
  small: '0 4px 20px rgba(0, 0, 0, 0.06)',
  medium: '0 8px 32px rgba(0, 0, 0, 0.08)',
  large: '0 20px 40px rgba(0, 0, 0, 0.12)',
  smallDark: '0 4px 20px rgba(0, 0, 0, 0.2)',
  mediumDark: '0 8px 32px rgba(0, 0, 0, 0.3)',
  largeDark: '0 20px 40px rgba(0, 0, 0, 0.4)',
};

// Gradient Generator
export const createGradient = (color1, color2, direction = '135deg') => 
  `linear-gradient(${direction}, ${color1}, ${color2})`;

// Primary Gradients
export const gradients = {
  primary: createGradient(modernBlue.primary, modernBlue.primaryDark),
  secondary: createGradient(modernBlue.secondary, modernBlue.secondaryDark),
  accent: createGradient(modernBlue.accent, modernBlue.accentDark),
  success: createGradient(modernBlue.success, '#059669'),
  warning: createGradient(modernBlue.warning, '#D97706'),
  error: createGradient(modernBlue.error, '#DC2626'),
  text: createGradient('#1F2937', '#4B5563'),
  textLight: createGradient('#374151', '#6B7280'),
};

// Universal Modern Card Component
export const ModernCard = styled(Paper)(({ theme, hover = true }) => ({
  ...createGlassmorphismBg(theme),
  padding: theme.spacing(3),
  borderRadius: 24,
  position: 'relative',
  overflow: 'hidden',
  boxShadow: theme.palette.mode === 'dark' ? shadows.mediumDark : shadows.medium,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  ...(hover && {
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: theme.palette.mode === 'dark' ? shadows.largeDark : shadows.large,
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.04)' 
        : 'rgba(255, 255, 255, 1)',
    }
  })
}));

// Universal Modern Button Component
export const ModernButton = styled(Button)(({ theme, variant: buttonVariant = 'primary' }) => {
  const getVariantStyles = () => {
    switch (buttonVariant) {
      case 'secondary':
        return {
          background: gradients.secondary,
          boxShadow: `0 8px 24px ${modernBlue.secondary}40`,
          '&:hover': {
            boxShadow: `0 12px 32px ${modernBlue.secondary}50`,
          }
        };
      case 'accent':
        return {
          background: gradients.accent,
          boxShadow: `0 8px 24px ${modernBlue.accent}40`,
          '&:hover': {
            boxShadow: `0 12px 32px ${modernBlue.accent}50`,
          }
        };
      default:
        return {
          background: gradients.primary,
          boxShadow: `0 8px 24px ${modernBlue.primary}40`,
          '&:hover': {
            boxShadow: `0 12px 32px ${modernBlue.primary}50`,
          }
        };
    }
  };

  return {
    borderRadius: 16,
    padding: theme.spacing(1.5, 3),
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '0.95rem',
    border: 'none',
    color: 'white',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    ...getVariantStyles(),
    '&:hover': {
      transform: 'translateY(-2px)',
      ...getVariantStyles()['&:hover'],
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1.2, 2.5),
      fontSize: '0.875rem',
    }
  };
});

// Universal Modern Avatar Component
export const ModernAvatar = styled(Avatar)(({ theme, variant: avatarVariant = 'primary' }) => {
  const getVariantGradient = () => {
    switch (avatarVariant) {
      case 'secondary': return gradients.secondary;
      case 'accent': return gradients.accent;
      case 'success': return gradients.success;
      case 'warning': return gradients.warning;
      case 'error': return gradients.error;
      default: return gradients.primary;
    }
  };

  return {
    background: getVariantGradient(),
    width: 56,
    height: 56,
    boxShadow: `0 8px 24px ${modernBlue.primary}30`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: `0 12px 32px ${modernBlue.primary}40`,
    },
    [theme.breakpoints.down('sm')]: {
      width: 48,
      height: 48,
    }
  };
});

// Modern Typography Styles
export const modernTypography = {
  heading: {
    fontWeight: 700,
    background: gradients.text,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  gradientHeading: {
    fontWeight: 700,
    background: gradients.primary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  body: {
    fontWeight: 500,
    lineHeight: 1.6,
  }
};

// Modern Container Styles
export const modernContainer = {
  main: (theme) => ({
    maxWidth: '1200px',
    margin: '0 auto',
    padding: theme.spacing(0, 2),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(0, 3),
    },
    [theme.breakpoints.up('md')]: {
      padding: 0,
    }
  }),
  section: (theme) => ({
    padding: theme.spacing(4, 0),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(6, 0),
    }
  })
};

// Responsive Grid Breakpoints
export const responsiveGrid = {
  mobile: { xs: 12 },
  tablet: { xs: 12, sm: 6 },
  desktop: { xs: 12, sm: 6, md: 4 },
  fullWidth: { xs: 12 },
  twoCol: { xs: 12, md: 6 },
  threeCol: { xs: 12, sm: 6, md: 4 },
  fourCol: { xs: 12, sm: 6, md: 3 },
};

// Loading Animation Styles
export const loadingStyles = {
  fadeIn: {
    '@keyframes fadeIn': {
      from: { opacity: 0, transform: 'translateY(20px)' },
      to: { opacity: 1, transform: 'translateY(0)' }
    },
    animation: 'fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
  }
};

// Mobile-First Responsive Breakpoints
export const breakpoints = {
  mobile: '(max-width: 599px)',
  tablet: '(min-width: 600px) and (max-width: 959px)',
  desktop: '(min-width: 960px)',
  largeDesktop: '(min-width: 1280px)',
};

// Mobile-Responsive Typography Scale
export const responsiveTypography = {
  hero: {
    fontSize: '2rem',
    fontWeight: 700,
    lineHeight: 1.2,
    '@media (min-width: 600px)': {
      fontSize: '3rem',
    },
    '@media (min-width: 960px)': {
      fontSize: '4rem',
    }
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.3,
    '@media (min-width: 600px)': {
      fontSize: '2rem',
    }
  },
  subtitle: {
    fontSize: '1.125rem',
    fontWeight: 500,
    lineHeight: 1.4,
    '@media (min-width: 600px)': {
      fontSize: '1.25rem',
    }
  },
  body: {
    fontSize: '0.875rem',
    lineHeight: 1.5,
    '@media (min-width: 600px)': {
      fontSize: '1rem',
    }
  }
};

// Mobile-Responsive Spacing System
export const responsiveSpacing = {
  sectionPadding: {
    padding: '1rem',
    '@media (min-width: 600px)': {
      padding: '2rem',
    },
    '@media (min-width: 960px)': {
      padding: '3rem',
    }
  },
  cardPadding: {
    padding: '1rem',
    '@media (min-width: 600px)': {
      padding: '1.5rem',
    },
    '@media (min-width: 960px)': {
      padding: '2rem',
    }
  },
  marginBottom: {
    marginBottom: '1rem',
    '@media (min-width: 600px)': {
      marginBottom: '1.5rem',
    },
    '@media (min-width: 960px)': {
      marginBottom: '2rem',
    }
  }
};

// Mobile-Responsive Container
export const responsiveContainer = (theme) => ({
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 1rem',
  [theme.breakpoints.up('sm')]: {
    padding: '0 2rem',
  },
  [theme.breakpoints.up('md')]: {
    padding: '0 3rem',
  }
});

export default {
  modernBlue,
  createGlassmorphismBg,
  shadows,
  gradients,
  ModernCard,
  ModernButton,
  ModernAvatar,
  modernTypography,
  modernContainer,
  responsiveGrid,
  breakpoints,
  responsiveTypography,  responsiveSpacing,
  responsiveContainer,
  loadingStyles,
};
