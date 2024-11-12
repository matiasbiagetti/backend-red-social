import dotenv from 'dotenv';
import { get } from 'mongoose';

dotenv.config();

type Config = {
    PORT: number;
    MONGO_URI: string;
    JWT_SECRET: string;
    EMAIL_USERNAME: string;
    EMAIL_PASSWORD: string;
    CLIENT_URL: string;
    CLOUDINARY_NAME?: string;
    CLOUDINARY_API_KEY?: string;
    CLOUDINARY_API_SECRET?: string;
};

function getEnvVariable(key: string, defaultValue?: string): string {
    const value = process.env[key];
    if (!value && !defaultValue) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value || defaultValue!;
}

export const config: Config = {
    PORT: parseInt(getEnvVariable('PORT', '5000')),
    MONGO_URI: getEnvVariable('MONGO_URI'),
    JWT_SECRET: getEnvVariable('JWT_SECRET'),
    EMAIL_USERNAME: getEnvVariable('EMAIL_USERNAME'),
    EMAIL_PASSWORD: getEnvVariable('EMAIL_PASSWORD'),
    CLIENT_URL: getEnvVariable('CLIENT_URL'),
    CLOUDINARY_NAME: getEnvVariable('CLOUDINARY_NAME', ''),
    CLOUDINARY_API_KEY: getEnvVariable('CLOUDINARY_API_KEY', ''),
    CLOUDINARY_API_SECRET: getEnvVariable('CLOUDINARY_API_SECRET', ''),
};