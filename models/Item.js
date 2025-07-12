import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  title: String,
  description: String,
  images: [String],
  category: String,
  type: String,                
  size: String,               
  condition: String,          
  tags: [String],
  listedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // ✅ Admin Moderation Status
  moderationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  // ✅ Swap Availability Status
  availability: {
    type: String,
    enum: ['available', 'swapped'],
    default: 'available'
  }

}, { timestamps: true });

export default mongoose.model('Item', itemSchema);
