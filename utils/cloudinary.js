const cloudinaryCtrl = {};
require('dotenv').config({
    path: './config/config.env'
  })
  const  cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

cloudinaryCtrl.uploadImage = async (filePath) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: 'replit'
  })
}
cloudinaryCtrl.deleteImage_Cloud = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId)
}

module.exports = cloudinaryCtrl;