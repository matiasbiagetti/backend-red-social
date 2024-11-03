import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: mongoose.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  username: string;
  password: string;
  profileImage?: string;
  coverImage?: string;
  punctuation: number;
  following: mongoose.Schema.Types.ObjectId[];
  followers: mongoose.Schema.Types.ObjectId[];
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  gender: 'male' | 'female' | 'other';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  bio: { type: String },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String },
  coverImage: { type: String },
  punctuation: { type: Number, default: 0 },
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  tier: { type: String, default: 'bronze' },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
export default User;