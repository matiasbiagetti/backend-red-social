import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: mongoose.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthdate: Date;
  bio?: string;
  username: string;
  password: string;
  profileImage: string;
  coverImage?: string;
  following: mongoose.Schema.Types.ObjectId[];
  followers: mongoose.Schema.Types.ObjectId[];
  posts: mongoose.Schema.Types.ObjectId[];
  likes: mongoose.Schema.Types.ObjectId[];
  comments: mongoose.Schema.Types.ObjectId[];
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  gender: 'male' | 'female' | 'other';
  settings: {
    theme: 'light' | 'dark',
    languge: 'en' | 'es'
  };
  createdAt: Date;
  updatedAt: Date;
  refreshToken?: string | null;
  isEmailVerified?: boolean;
}

const UserSchema: Schema<IUser> = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  birthdate: { type: Date, required: true },
  bio: { type: String },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: 'https://res.cloudinary.com/dsczjznlw/image/upload/v1731551232/ADI/wt28egc6mzm88so3zqpb.png' },
  coverImage: { type: String , default: 'https://res.cloudinary.com/dsczjznlw/image/upload/v1733418674/ADI/ehwjkuc0wsb5ngpnsp1s.png' },
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  likes: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  tier: { type: String, default: 'bronze' },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  settings: {
    theme: { type: String, enum: ['light', 'dark'], default: 'dark' },
    language: { type: String, enum: ['en', 'es'], default: 'es' }
  },
  refreshToken: { type: String },
  isEmailVerified: { type: Boolean, default: false }
});

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
export default User;