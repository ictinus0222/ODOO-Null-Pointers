import Item from '../models/Item.js';
import User from '../models/User.js';

// ✅ Get all users (for admin panel)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// ✅ Get all "orders" (mocked as items that are swapped)
export const getAllOrders = async (req, res) => {
  try {
    const items = await Item.find({ availability: 'swapped' }).populate('listedBy', 'name email');
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// ✅ Approve a pending item listing
export const approveItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.moderationStatus = 'approved';
    await item.save();

    res.status(200).json({ message: 'Item approved' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve item' });
  }
};

// ✅ Reject a pending item listing
export const rejectItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.moderationStatus = 'rejected';
    await item.save();

    res.status(200).json({ message: 'Item rejected' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reject item' });
  }
};

// ✅ Delete any item (admin override)
export const adminDeleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    await item.deleteOne();
    res.status(200).json({ message: 'Item deleted by admin' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete item' });
  }
};

// ✅ Get all pending items for moderation
export const getPendingItems = async (req, res) => {
    try {
      const items = await Item.find({ moderationStatus: 'pending' }).populate('listedBy', 'name email');
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch pending items' });
    }
  };
  