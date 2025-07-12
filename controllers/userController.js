import User from '../models/User.js';
import Item from '../models/Item.js';

// ✅ Controller: Get logged-in user's profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

// ✅ Controller: Get items listed by the user
export const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ listedBy: req.user._id });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch items' });
  }
};

// ✅ Controller: Get swap history (mock version for now)
export const getSwapHistory = async (req, res) => {
  try {
    // For now, show items where availability is 'swapped'
    const swaps = await Item.find({ listedBy: req.user._id, availability: 'swapped' });
    res.status(200).json(swaps);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch swaps' });
  }
};
