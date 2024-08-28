import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IPost extends Document {
  user: mongoose.Schema.Types.ObjectId;
  title: string;
  body: string;
  location?: string;
  media?: string;
  likes: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema<IPost> = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  body: { type: String },
  location: { type: String },
  media: { type: String },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Post: Model<IPost> = mongoose.model<IPost>('Post', PostSchema);
export default Post;
