import express, { Application } from 'express';
import connectDB from './src/config/db';
import authRoutes from './src/routes/authRoutes';
import userRoutes from './src/routes/userRoutes';
import postRoutes from './src/routes/postRoutes';
import adRoutes from './src/routes/adRoutes';
import { config } from './src/config/environment';
import bodyParser from 'body-parser';

const cors = require('cors');


// Initialize express application
const app: Application = express();

// Enable CORS for all origins
app.use(cors({
  origin: '*', 
  credentials: true, 
}));

app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));



// Connect to the database
connectDB();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/ads', adRoutes);

// Ping route
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Set the port to listen on
const PORT = config.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

