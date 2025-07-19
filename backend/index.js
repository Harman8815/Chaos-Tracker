const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/ChaosTracker')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Error connecting to MongoDB:', err));

const taskRoutes = require('./routes/taskRoutes');
const habbitdayRoutes = require('./routes/habbitdayRoutes');
const dailyJounalRoutes = require('./routes/dailyJournalRoutes');

app.use('/api/tasks', taskRoutes);
app.use('/api/habbitday', habbitdayRoutes);
app.use('/api/dailyJounal', dailyJounalRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('Habit Tracker API');
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
