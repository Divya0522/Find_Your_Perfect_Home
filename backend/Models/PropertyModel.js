

const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  location: {
    address: { type: String, required: [true, 'Address is required'] },
    latitude: { type: Number, required: [true, 'Latitude is required'] },
    longitude: { type: Number, required: [true, 'Longitude is required'] },
  },
  description: { type: String },
  city: { type: String, required: true, default: 'Unknown' },
  bedrooms: { type: Number, required: true, default: 0 },
  bathrooms: { type: Number, required: true, default: 0 },
  sqfeet: { type: Number, required: true ,default:0},
  property_type: { type: String, required: true },
  images: [{ type: String }],
  features: [{ type: String }],
  reviews: [
    {
      user_id: {
        type: String,
        ref: 'User',
        required: true,
      },
      review: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
    },
  ],
  
likes: [{ 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likedAt: { type: Date, default: Date.now }
}],
dislikes: [{ 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dislikedAt: { type: Date, default: Date.now }
}],
likeCount: { type: Number, default: 0 },
dislikeCount: { type: Number, default: 0 },
  rating: {
    average_rating: { type: Number, default: 0 },
    total_reviews: { type: Number, default: 0 },
  },
  availability: { type: String },
  property_id: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Property', PropertySchema);