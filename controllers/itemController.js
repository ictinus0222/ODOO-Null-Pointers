import Item from '../models/Item.js';
import cloudinary from '../utils/cloudinary.js';

// @desc   Get all products (with pagination & optional search)
// @route  GET /api/products
export const getAllItems = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = 10;
    const keyword = req.query.keyword
      ? { title: { $regex: req.query.keyword, $options: 'i' } }
      : {};

    const count = await Item.countDocuments({ ...keyword });
    const items = await Item.find({ ...keyword })
      .populate('listedBy', 'name email')
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.status(200).json({
      items,
      page,
      pages: Math.ceil(count / pageSize)
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// @desc   Get product by ID
// @route  GET /api/products/:id
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('listedBy', 'name email');

    if (!item) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

// ✅ Controller: Create a new item listing
// @route  POST /api/items
export const createItem = async (req, res) => {
  try {
    console.log('[BODY]', req.body);
    console.log('[FILE]', req.file);
    const {
      title,
      description,
      category,
      type,
      size,
      condition,
      tags
    } = req.body;

    let uploadedImageUrl = '';

    // If file is present, upload to Cloudinary
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path);
      uploadedImageUrl = uploadResult.secure_url;
    }

    const newItem = new Item({
      title,
      description,
      category,
      type,
      size,
      condition,
      tags,
      images: uploadedImageUrl ? [uploadedImageUrl] : [],
      listedBy: req.user._id,
      moderationStatus: 'pending',
      availability: 'available'
    });

    await newItem.save();
    res.status(201).json({ message: 'Item submitted for review', item: newItem });

  } catch (error) {
    console.error('[CREATE ITEM ERROR]', error);
    res.status(500).json({ message: 'Failed to create item' });
  }
};

// @desc   Update a product
// @route  PUT /api/products/:id
export const updateItem = async (req, res) => {
  const { title, description, images, category, status } = req.body;

  try {
    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ message: 'Product not found' });
    if (item.listedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to update this product' });
    }

    item.title = title || item.title;
    item.description = description || item.description;
    item.images = images || item.images;
    item.category = category || item.category;
    item.status = status || item.status;

    const updatedItem = await item.save();

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product' });
  }
};

// @desc   Delete a product
// @route  DELETE /api/products/:id
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ message: 'Product not found' });
    if (item.listedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this product' });
    }

    await item.deleteOne();

    res.status(200).json({ message: 'Product removed' });
  } catch (error) {
    console.error('[DELETE ERROR]', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
};
