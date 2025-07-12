import cloudinary from 'cloudinary';
import streamifier from 'streamifier';

// @desc Upload image to Cloudinary
// @route POST /api/upload
// @access Private (requires token)
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image file uploaded' });

    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          { folder: 'rewear-items' },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req);
    res.status(201).json({ url: result.secure_url });
  } catch (err) {
    next(err);
  }
};
