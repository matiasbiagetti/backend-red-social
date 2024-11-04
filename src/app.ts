import express, { Application } from 'express';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import adRoutes from './routes/adRoutes';

// Initialize express application
const app: Application = express();

// Connect to the database
connectDB();

// Middleware to parse incoming JSON requests
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/ads', adRoutes);


app.get('/ping', (req, res) => {
  res.send('pong');
});


export default app;
