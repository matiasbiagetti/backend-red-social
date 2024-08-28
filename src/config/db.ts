import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('MongoDB connected');
    } catch (err: any) {
        console.error((err as Error).message);
        console.error("Cannot connect to MongoDB");
        process.exit(1);
    }
};

export default connectDB;

 