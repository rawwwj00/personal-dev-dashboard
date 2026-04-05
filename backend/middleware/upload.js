const { v2: cloudinary } = require('cloudinary');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

console.log('[CLOUDINARY CONFIG] Checking env vars...');
console.log('[CLOUDINARY CONFIG] CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'MISSING');
console.log('[CLOUDINARY CONFIG] API_KEY:', process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING');
console.log('[CLOUDINARY CONFIG] API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('[CLOUDINARY] Cloudinary configured');

// Temp upload directory
const uploadDir = path.join(__dirname, '../temp');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Local multer storage - just save temp files
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const uploadImage = multer({ 
  storage: localStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

const uploadVideo = multer({ 
  storage: localStorage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Helper to upload to Cloudinary
async function uploadToCloudinary(filePath, folderName, resourceType = 'auto') {
  try {
    console.log('[CLOUDINARY UPLOAD] Uploading to folder:', folderName, 'resource_type:', resourceType);
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folderName,
      resource_type: resourceType,
      timeout: 60000,
    });
    console.log('[CLOUDINARY UPLOAD] Success:', result.public_id);
    return result;
  } catch (err) {
    console.error('[CLOUDINARY UPLOAD ERROR]', err.message);
    throw err;
  }
}

module.exports = { cloudinary, uploadImage, uploadVideo, uploadToCloudinary, uploadDir };
