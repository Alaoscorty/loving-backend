import { v2 as cloudinary } from 'cloudinary';
import { logger } from './logger';

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '';
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || '';

if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
  logger.info('✅ Cloudinary configuré');
} else {
  logger.warn('⚠️ Cloudinary non configuré');
}

export const uploadImage = async (
  file: string | Buffer,
  folder: string = 'loving'
): Promise<{ url: string; public_id: string }> => {
  try {
    const data = Buffer.isBuffer(file) ? `data:image/*;base64,${file.toString('base64')}` : file;
    const result = await cloudinary.uploader.upload(data as string, {
      folder,
      resource_type: 'image',
      transformation: [
        { width: 1000, height: 1000, crop: 'limit' },
        { quality: 'auto' },
        { format: 'auto' },
      ],
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    logger.error('Erreur lors de l\'upload Cloudinary:', error);
    throw new Error('Erreur lors de l\'upload de l\'image');
  }
};

export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    logger.error('Erreur lors de la suppression Cloudinary:', error);
    throw new Error('Erreur lors de la suppression de l\'image');
  }
};

export { cloudinary };
