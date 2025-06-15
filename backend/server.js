const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dressing-organizer', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
const clothingItemsRouter = require('./routes/clothingItems');
const outfitsRouter = require('./routes/outfits');
const notificationsRouter = require('./routes/notifications');
const authRouter = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');
const activityRoutes = require('./routes/activity');
const userRoutes = require('./routes/userRoutes');
const socialRoutes = require('./routes/social');

app.use('/api/user', userRoutes);
app.use('/api/clothing-items', clothingItemsRouter);
app.use('/api/outfits', outfitsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/auth', authRouter);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/social', socialRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
