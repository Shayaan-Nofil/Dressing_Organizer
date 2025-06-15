import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Badge, IconButton, Menu, MenuItem, CircularProgress, Tooltip } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';
import { getNotifications, markNotificationRead } from '../../services/notifications';

function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  // Notification State
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const data = await getNotifications(token);
        setNotifications(data);
      } catch (e) {
        setError('Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [isAuthenticated, refresh]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleBellClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleBellClose = () => {
    setAnchorEl(null);
  };
  const handleMarkRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await markNotificationRead(id, token);
      setRefresh(r => !r);
    } catch (e) {
      setError('Failed to mark as read');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
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
              <Button color="inherit" onClick={() => navigate('/clothes')}>My Clothes</Button>
              <Button color="inherit" onClick={() => navigate('/outfits')}>My Outfits</Button>
              <Tooltip title="Notifications">
                <IconButton color="inherit" onClick={handleBellClick} sx={{ ml: 1 }}>
                  <Badge badgeContent={unreadCount} color="secondary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleBellClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                {loading ? (
                  <MenuItem><CircularProgress size={24} /></MenuItem>
                ) : notifications.length === 0 ? (
                  <MenuItem>No notifications</MenuItem>
                ) : (
                  notifications.map(n => (
                    <MenuItem key={n._id} selected={!n.read} divider>
                      <Box sx={{ flexGrow: 1 }}>
                        {n.message}
                        <Typography variant="caption" color="text.secondary" display="block">
                          {new Date(n.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                      {!n.read && (
                        <Button size="small" color="primary" onClick={() => handleMarkRead(n._id)}>
                          Mark as read
                        </Button>
                      )}
                    </MenuItem>
                  ))
                )}
              </Menu>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
              <Button color="inherit" onClick={() => navigate('/register')}>Register</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;