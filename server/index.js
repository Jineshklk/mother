require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
 // Load environment variables


const app = express();
app.use(cors({
  origin: 'https://mother-3.onrender.com', // your frontend
  credentials: true
}));
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/uploads', express.static('uploads'));

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
