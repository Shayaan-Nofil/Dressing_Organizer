import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';
import axios from 'axios';

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
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (Object.keys(formData.measurements).includes(name)) {
      setFormData({ ...formData, measurements: { ...formData.measurements, [name]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
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
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Name"
            name="name"
            autoFocus
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            name="stylePreferences"
            label="Style Preferences (comma separated)"
            value={formData.stylePreferences}
            onChange={handleChange}
          />
          <Typography variant="subtitle1" sx={{ mt: 2 }}>Measurements (optional)</Typography>
          <TextField
            margin="normal"
            fullWidth
            name="height"
            label="Height (cm)"
            value={formData.measurements.height}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            name="weight"
            label="Weight (kg)"
            value={formData.measurements.weight}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            name="bust"
            label="Bust (cm)"
            value={formData.measurements.bust}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            name="waist"
            label="Waist (cm)"
            value={formData.measurements.waist}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            name="hips"
            label="Hips (cm)"
            value={formData.measurements.hips}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Register;