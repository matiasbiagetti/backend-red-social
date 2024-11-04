import mongoose from 'mongoose';
import { config } from './environment';

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(config.MONGO_URI as string);
        
        console.log('MongoDB connected');
    } catch (err: any) {
        console.error((err as Error).message);
        console.error("Cannot connect to MongoDB");
        process.exit(1);
    }
};

export default connectDB;

 