import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';

const trends = [
  {
    title: 'Summer Essentials',
    description: 'Lightweight shirts, linen pants, and pastel colors are trending this summer! Try pairing a pastel shirt with white jeans for a fresh look.'
  },
  {
    title: 'Layering for Fall',
    description: 'Layer up with cardigans and scarves. Earth tones and boots are in this fall.'
  },
  {
    title: 'Statement Accessories',
    description: 'Bold accessories like chunky necklaces and oversized sunglasses can elevate any outfit.'
  },
  {
    title: 'Sustainable Fashion',
    description: 'Eco-friendly brands and upcycled clothing are on the rise. Consider integrating sustainable pieces into your wardrobe.'
  },
  {
    title: 'Classic Revival',
    description: 'Timeless pieces like blazers and denim jackets never go out of style. Mix classics with modern items for a unique look.'
  }
];

function TrendsFeed() {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>Trends & Inspiration</Typography>
      <Grid container spacing={2}>
        {trends.map((trend, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600}>{trend.title}</Typography>
                <Typography variant="body2" color="text.secondary">{trend.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default TrendsFeed;
