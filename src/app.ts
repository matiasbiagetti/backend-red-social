import express, { Application } from 'express';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import adRoutes from './routes/adRoutes';

// Initialize express application
const app: Application = express();

// Connect to the database
connectDB();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/ads', adRoutes);

// Root endpoint (optional, for testing server status)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Export the app for use in server.ts
export default app;
