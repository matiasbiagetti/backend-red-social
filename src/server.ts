import dotenv from 'dotenv';
import app from './app';

// Load environment variables from .env file
dotenv.config();

// Set the port to listen on
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});