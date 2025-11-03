import cloudinary from 'cloudinary';

export const saveFileCloud = async (file) => {
  cloudinary.v2.config({
    secure: true,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  const sonuc = await cloudinary.v2.uploader.upload(file.path);
  return sonuc.secure_url;
};
