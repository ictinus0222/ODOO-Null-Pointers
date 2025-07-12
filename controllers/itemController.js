import Item from '../models/Item.js';
import User from '../models/User.js';
import cloudinary from '../utils/cloudinary.js';
import { io } from '../server.js';

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
      const item = await Item.findById(req.params.id)
        .populate('listedBy', 'name email')
        .populate('swapRequests.user', 'name email')
        .populate('redeemedBy', 'name email');
  
      if (!item) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.status(200).json(item);
    } catch (error) {
      console.error('[GET ITEM BY ID ERROR]', error);  // ✅ Add this
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
    io.emit('item:new', newItem);

    const user = await User.findById(req.user._id);
    user.points += 10;
    await user.save();    res.status(201).json({ message: 'Item submitted for review', item: newItem });

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

// @desc    Request to swap an item
// @route   POST /api/items/:id/request-swap
// @access  Private
export const requestSwap = async (req, res) => {
    try {
      const item = await Item.findById(req.params.id);
  
      if (!item) return res.status(404).json({ message: 'Item not found' });
  
      // Prevent users from requesting their own item
      if (item.listedBy.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: 'You cannot request your own item' });
      }
  
      // Prevent duplicate requests
      const alreadyRequested = item.swapRequests.some(request => 
        request.user && request.user.toString() === req.user._id.toString()
      );
      if (alreadyRequested) {
        return res.status(400).json({ message: 'You have already requested to swap this item' });
      }
  
      // Add user to swap requests with proper structure
      item.swapRequests.push({
        user: req.user._id,
        status: 'pending',
        requestedAt: new Date()
      });
      await item.save();
      io.emit('swap:requested', { itemId: item._id, userId: req.user._id });
  
      res.status(200).json({ message: 'Swap request submitted successfully' });
    } catch (error) {
      console.error('[SWAP REQUEST ERROR]', error);
      res.status(500).json({ message: 'Failed to request swap' });
    }
  };
  
  export const handleSwapDecision = async (req, res) => {
    const { itemId } = req.params;
    const { userId, decision } = req.body;
  
    try {
      const item = await Item.findById(itemId);
  
      if (!item) return res.status(404).json({ message: 'Item not found' });
  
      // Only the owner can take action
      if (item.listedBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
  
      // Check if the user has a swap request
      const hasRequest = item.swapRequests.some(request => 
        request.user && request.user.toString() === userId
      );
      
      if (!hasRequest) {
        return res.status(400).json({ message: 'No such swap request' });
      }
  
      if (decision === 'accept') {
        item.availability = 'swapped';
        item.swappedWith = userId;
        item.swapRequests = []; // Clear all
        res.status(200).json({ message: 'Swap successful! Item has been swapped.' });
      } else if (decision === 'reject') {
        item.swapRequests = item.swapRequests.filter(request => 
          request.user && request.user.toString() !== userId
        );
        res.status(200).json({ message: 'Swap request rejected.' });
      } else {
        return res.status(400).json({ message: 'Invalid decision' });
      }
  
      await item.save();
      io.emit('swap:decision', { itemId: item._id, userId, decision });
  
    } catch (err) {
      console.error('[SWAP DECISION ERROR]', err);
      res.status(500).json({ message: 'Server error while handling swap decision' });
    }
  };
  
  export const redeemItem = async (req, res) => {
    try {
      const item = await Item.findById(req.params.itemId);
      const user = await User.findById(req.user._id);
  
      if (!item) return res.status(404).json({ message: 'Item not found' });
      if (item.listedBy.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: 'Cannot redeem your own item' });
      }
      if (item.availability !== 'available') {
        return res.status(400).json({ message: 'Item not available' });
      }
      if (user.points < 30) {
        return res.status(400).json({ message: 'Not enough points' });
      }
  
      user.points -= 30;
      await user.save();
  
      item.availability = 'redeemed';
      item.redeemedBy = req.user._id;
      await item.save();
      io.emit('item:redeemed', { itemId: item._id, userId: req.user._id });
  
      res.status(200).json({ message: 'Item successfully redeemed via points' });
    } catch (error) {
      console.error('[REDEEM ERROR]', error);
      res.status(500).json({ message: 'Server error during redemption' });
    }
  };
  