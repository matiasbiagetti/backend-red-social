import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect("mongodb+srv://biagettimati:T99h54gffTjxgyXd@test-cluster.sco4q.mongodb.net/");
        console.log('MongoDB connected');
    } catch (err: any) {
        console.error((err as Error).message);
        console.error("Cannot connect to MongoDB");
        process.exit(1);
    }
};

export default connectDB;

 