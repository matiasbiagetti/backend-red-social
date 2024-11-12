// utils/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/environment';

cloudinary.config({
    cloud_name: config.CLOUDINARY_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET,
  });
  

interface MediaItem {
    base64: string;
  }

  export const uploadMediaToCloudinary = async (media: String[]): Promise<string[]> => {
    try {
      const mediaUrls: string[] = [];
  
      for (const base64encoded of media) {
  
        // Detecting resource type from base64 string
        const isVideo = base64encoded.startsWith('AAAA') || base64encoded.startsWith('OggS') || base64encoded.startsWith('fLaC');
        const resourceType = isVideo ? 'video' : 'image';
  
        // Uploading media to Cloudinary
        const result = await cloudinary.uploader.upload(
          `data:base64,${base64encoded}`,
          { resource_type: resourceType, folder: 'uploads' }
        );
  
        mediaUrls.push(result.secure_url);
      }
  
      return mediaUrls;
    } catch (error: any) {
        throw new Error(`Error uploading media to Cloudinary: ${error.message}`);
    }
  };