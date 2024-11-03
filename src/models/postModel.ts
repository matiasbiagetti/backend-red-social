import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IPost extends Document {
  _id: mongoose.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  body: string
  media: string[];
  location: {
    name: String, 
    coordinates: {
      lat: Number, 
      lng: Number, 
    }
  },
  comments: mongoose.Schema.Types.ObjectId[];
  likes: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema<IPost> = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  body: { type: String },
  location: {
    name: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },  
  media: [{ type: String }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Post: Model<IPost> = mongoose.model<IPost>('Post', PostSchema);

export default Post;
