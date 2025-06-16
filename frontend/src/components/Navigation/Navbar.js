import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  modernBlue, 
  gradients, 
  createGlassmorphismBg, 
  shadows,
  ModernButton 
} from '../../theme/modernDesign';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StyleIcon from '@mui/icons-material/Style';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SecurityIcon from '@mui/icons-material/Security';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

// Styled Components
const ModernAppBar = styled(AppBar)(({ theme }) => ({
  ...createGlassmorphismBg(theme, 0.95),
  boxShadow: theme.palette.mode === 'dark' ? shadows.mediumDark : shadows.medium,
  borderBottom: `1px solid ${theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.05)'}`,
  position: 'sticky',
  top: 0,
  zIndex: 1100,
}));

const BrandTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: '1.5rem',
  background: gradients.primary,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.25rem',
  }
}));

const NavButton = styled(Button)(({ theme, active }) => ({
  borderRadius: 12,
  padding: theme.spacing(1, 2),
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '0.875rem',
  margin: theme.spacing(0, 0.5),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  ...(active ? {
    background: gradients.primary,
    color: 'white',
    boxShadow: `0 4px 12px ${modernBlue.primary}40`,
    '&:hover': {
      background: gradients.primary,
      transform: 'translateY(-2px)',
      boxShadow: `0 6px 16px ${modernBlue.primary}50`,
    }
  } : {
    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)',
    '&:hover': {
      background: theme.palette.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.1)' 
        : 'rgba(0, 0, 0, 0.05)',
      transform: 'translateY(-1px)',
    }
  }),
  [theme.breakpoints.down('md')]: {
    display: 'none',
  }
}));

const MobileDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 280,
    ...createGlassmorphismBg(theme),
    borderRight: `1px solid ${theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.05)'}`,
  }
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  background: gradients.secondary,
  width: 40,
  height: 40,
  fontSize: '1.2rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: `0 8px 24px ${modernBlue.secondary}40`,
  }
}));

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setProfileMenuAnchor(null);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: DashboardIcon },
    { label: 'Outfits', path: '/outfits', icon: StyleIcon },
    { label: 'AI Features', path: '/ai-features', icon: SmartToyIcon },
    { label: 'My Clothes', path: '/clothes', icon: CheckroomIcon },
    { label: 'Analytics', path: '/analytics', icon: AnalyticsIcon },
    { label: 'Privacy', path: '/privacy', icon: SecurityIcon },
  ];

  const authItems = [
    { label: 'Login', path: '/login', icon: LoginIcon },
    { label: 'Register', path: '/register', icon: AppRegistrationIcon },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const getUserInitial = () => {
    return user?.email ? user.email.charAt(0).toUpperCase() : 'U';
  };

  return (
    <>
      <ModernAppBar position="sticky" elevation={0}>
        <Toolbar sx={{ 
          minHeight: { xs: 64, sm: 70 },
          px: { xs: 2, sm: 3, md: 4 }
        }}>
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              edge="start"
              color={modernBlue.primary}
              aria-label="menu"
              onClick={() => setMobileMenuOpen(true)}
              sx={{ 
                mr: 2,
                p: 1,
                borderRadius: 2,
                '&:hover': {
                  background: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(0, 0, 0, 0.05)',
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Brand */}
          <BrandTypography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
            onClick={() => navigate('/')}
          >
            Dressing Organizer
          </BrandTypography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isAuthenticated ? (
                <>
                  {navItems.map((item) => (
                    <NavButton
                      key={item.path}
                      active={location.pathname === item.path}
                      onClick={() => navigate(item.path)}
                      startIcon={<item.icon sx={{ fontSize: '1.1rem' }} />}
                    >
                      {item.label}
                    </NavButton>
                  ))}
                  
                  {/* Profile Menu */}
                  <Box sx={{ ml: 2 }}>
                    <UserAvatar
                      onClick={(e) => setProfileMenuAnchor(e.currentTarget)}
                    >
                      {getUserInitial()}
                    </UserAvatar>
                    <Menu
                      anchorEl={profileMenuAnchor}
                      open={Boolean(profileMenuAnchor)}
                      onClose={() => setProfileMenuAnchor(null)}
                      PaperProps={{
                        sx: {
                          ...createGlassmorphismBg(theme),
                          borderRadius: 3,
                          mt: 1,
                          boxShadow: theme.palette.mode === 'dark' 
                            ? shadows.mediumDark 
                            : shadows.medium,
                        }
                      }}
                    >
                      <MenuItem 
                        onClick={() => {
                          navigate('/profile');
                          setProfileMenuAnchor(null);
                        }}
                        sx={{ 
                          borderRadius: 2,
                          mx: 1,
                          my: 0.5,
                          gap: 2
                        }}
                      >
                        <PersonIcon sx={{ fontSize: '1.1rem' }} />
                        Profile
                      </MenuItem>
                      <Divider sx={{ mx: 1 }} />
                      <MenuItem 
                        onClick={handleLogout}
                        sx={{ 
                          borderRadius: 2,
                          mx: 1,
                          my: 0.5,
                          gap: 2,
                          color: 'error.main'
                        }}
                      >
                        <LogoutIcon sx={{ fontSize: '1.1rem' }} />
                        Logout
                      </MenuItem>
                    </Menu>
                  </Box>
                </>
              ) : (
                <>
                  {authItems.map((item) => (
                    <NavButton
                      key={item.path}
                      active={location.pathname === item.path}
                      onClick={() => navigate(item.path)}
                      startIcon={<item.icon sx={{ fontSize: '1.1rem' }} />}
                    >
                      {item.label}
                    </NavButton>
                  ))}
                </>
              )}
            </Box>
          )}

          {/* Mobile Profile Avatar */}
          {isMobile && isAuthenticated && (
            <UserAvatar onClick={(e) => setProfileMenuAnchor(e.currentTarget)}>
              {getUserInitial()}
            </UserAvatar>
          )}
        </Toolbar>
      </ModernAppBar>

      {/* Mobile Drawer */}
      <MobileDrawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <BrandTypography variant="h6">
            Dressing Organizer
          </BrandTypography>
          {isAuthenticated && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Welcome, {user?.email}
            </Typography>
          )}
        </Box>
        
        <List sx={{ p: 2 }}>
          {isAuthenticated ? (
            <>
              {navItems.map((item) => (
                <ListItem 
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 3,
                    mb: 1,
                    cursor: 'pointer',
                    ...(location.pathname === item.path && {
                      background: 'rgba(59, 130, 246, 0.12)', // light blue background
                      color: modernBlue.primary,
                      boxShadow: `0 4px 12px ${modernBlue.primary}30`,
                    }),
                    '&:hover': {
                      background: location.pathname === item.path 
                        ? gradients.primary
                        : theme.palette.mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.1)' 
                          : 'rgba(0, 0, 0, 0.05)',
                    }
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: location.pathname === item.path ? modernBlue.primary : 'inherit',
                    minWidth: 40
                  }}>
                    <item.icon />
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: location.pathname === item.path ? 600 : 500
                    }}
                  />
                </ListItem>
              ))}
              
              <Divider sx={{ my: 2 }} />
              
              <ListItem 
                onClick={() => handleNavigation('/profile')}
                sx={{
                  borderRadius: 3,
                  mb: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    background: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(0, 0, 0, 0.05)',
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItem>
              
              <ListItem 
                onClick={handleLogout}
                sx={{
                  borderRadius: 3,
                  cursor: 'pointer',
                  color: 'error.main',
                  '&:hover': {
                    background: 'rgba(239, 68, 68, 0.1)',
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </>
          ) : (
            <>
              {authItems.map((item) => (
                <ListItem 
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 3,
                    mb: 1,
                    cursor: 'pointer',
                    ...(location.pathname === item.path && {
                      background: gradients.primary,
                      color: 'white',
                    }),
                    '&:hover': {
                      background: location.pathname === item.path 
                        ? gradients.primary
                        : theme.palette.mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.1)' 
                          : 'rgba(0, 0, 0, 0.05)',
                    }
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: location.pathname === item.path ? 'white' : 'inherit',
                    minWidth: 40
                  }}>
                    <item.icon />
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItem>
              ))}
            </>
          )}
        </List>
      </MobileDrawer>

      {/* Mobile Profile Menu */}
      {isMobile && (
        <Menu
          anchorEl={profileMenuAnchor}
          open={Boolean(profileMenuAnchor)}
          onClose={() => setProfileMenuAnchor(null)}
          PaperProps={{
            sx: {
              ...createGlassmorphismBg(theme),
              borderRadius: 3,
              mt: 1,
            }
          }}
        >
          <MenuItem 
            onClick={() => {
              navigate('/profile');
              setProfileMenuAnchor(null);
            }}
            sx={{ gap: 2 }}
          >
            <PersonIcon />
            Profile
          </MenuItem>
          <Divider />
          <MenuItem 
            onClick={handleLogout}
            sx={{ gap: 2, color: 'error.main' }}
          >
            <LogoutIcon />
            Logout
          </MenuItem>
        </Menu>
      )}
    </>
  );
}

export default Navbar;