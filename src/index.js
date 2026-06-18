const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connect
mongoose.connect(process.env.MONGO_DB_URL)
    .then(() => console.log('MongoDB Connected!'))
    .catch((err) => console.log('DB Error:', err));

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'LegalEase Server Running!' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const lawyerRoutes = require('./routes/lawyer.routes');
app.use('/api/lawyers', lawyerRoutes);

const hiringRoutes = require('./routes/hiring.routes');
app.use('/api/hirings', hiringRoutes);

const commentRoutes = require('./routes/comment.routes');
app.use('/api/comments', commentRoutes);