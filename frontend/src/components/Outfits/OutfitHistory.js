import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Box } from '@mui/material';
import axios from 'axios';

function OutfitHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/outfits', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Flatten wearHistory for each outfit
        const outfits = response.data;
        const rows = [];
        outfits.forEach(outfit => {
          if (outfit.wearHistory && outfit.wearHistory.length > 0) {
            outfit.wearHistory.forEach(date => {
              rows.push({
                name: outfit.name,
                items: outfit.items.map(i => i.name).join(', '),
                date: new Date(date).toLocaleDateString(),
                notes: outfit.notes || '',
                rating: outfit.rating || ''
              });
            });
          }
        });
        // Sort by date descending
        rows.sort((a, b) => new Date(b.date) - new Date(a.date));
        setHistory(rows);
      } catch (err) {
        setError('Failed to load outfit history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Outfit Wear History</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date Worn</TableCell>
              <TableCell>Outfit Name</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Rating</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.length === 0 ? (
              <TableRow><TableCell colSpan={5} align="center">No wear history yet.</TableCell></TableRow>
            ) : (
              history.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.items}</TableCell>
                  <TableCell>{row.notes}</TableCell>
                  <TableCell>{row.rating}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default OutfitHistory;
