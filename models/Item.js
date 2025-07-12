import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String },
  size: { type: String },
  condition: { type: String },
  tags: [{ type: String }],
  images: [{ type: String }],

  listedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  moderationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },

  availability: {
    type: String,
    enum: ['available', 'swapped', 'redeemed'],
    default: 'available',
  },

  swapRequests: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
      },
      requestedAt: {
        type: Date, 
        default: Date.now,
      },
    },
  ],

  swapRequestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  redeemedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);

export default Item;
