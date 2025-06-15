import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Paper, Divider } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={6} sx={{ p: 4, width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <PersonIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
          <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
            Login
          </Typography>
          <Divider sx={{ width: '100%', mb: 2 }} />
          {error && <Box sx={{ width: '100%', mb: 2 }}><span style={{ color: 'red' }}>{error}</span></Box>}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Box>
          <Divider sx={{ width: '100%', my: 2 }} />
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            onClick={() => navigate('/register')}
          >
            Don't have an account? Register
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;