
const mongoose = require('mongoose'); 
const express = require('express');
const Property = require('../Models/PropertyModel');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const multer=require('multer');
const path=require('path');
const userModel=require("../Models/userModel");


router.get('/', async (req, res) => {
  try {
    const {
      homeType,
      bedrooms,
      bathrooms,
      city,
      minArea,
      maxArea,
      minPrice,
      maxPrice,
      minRating,
      property_type
    } = req.query;

    const filter = {};

  filter.status = { $ne: 'rejected' }; 
    if (homeType) filter.property_type = homeType;
    if (bedrooms) filter.bedrooms = parseInt(bedrooms);
    if (bathrooms) filter.bathrooms = parseInt(bathrooms);
    if (city) filter.city = city;
    if (minArea || maxArea) {
      filter['location.area'] = {};
      if (minArea) filter['location.area'].$gte = parseInt(minArea);
      if (maxArea) filter['location.area'].$lte = parseInt(maxArea);
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }
    if (minRating) filter['rating.average_rating'] = { $gte: parseFloat(minRating) };
    if (property_type) filter.property_type = property_type;
    const properties = await Property.find(filter).populate('user_id', 'email');
    res.status(200).json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Error fetching properties' });
  }
});


router.get("/active-user-properties", async (req, res) => {
  try {
   
    const properties = await Property.find({})
      .populate({
        path: "user_id",
        match: { status: "active" }, 
        select: "email",
      })
      .exec();

    const filteredProperties = properties.filter((property) => property.user_id !== null);

    res.status(200).json(filteredProperties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ message: "Error fetching properties" });
  }
});


router.post('/', authMiddleware, async (req, res) => {
  try {
    console.log('Received POST request at:', new Date().toISOString()); 
 
    delete req.body._id;
    delete req.body.property_id;
    const numericFields = ['price', 'bedrooms', 'bathrooms'];
    const convertedBody = { ...req.body };

    
    numericFields.forEach(field => {
      if (typeof convertedBody[field] === 'string') {
        convertedBody[field] = parseFloat(convertedBody[field]);
      }
    });

    if (convertedBody.location) {
      convertedBody.location = {
        address: convertedBody.location.address,
        latitude: parseFloat(convertedBody.location.latitude),
        longitude: parseFloat(convertedBody.location.longitude)
      };
    }

    const requiredFields = {
      title: 'string',
      price: 'number',
      location: 'object',
      city: 'string',
      bedrooms: 'number',
      bathrooms: 'number',
      sqfeet: 'number',
      property_type: 'string',
      images: 'array'
    };


    const missingFields = Object.entries(requiredFields)
      .filter(([field]) => !convertedBody[field])
      .map(([field]) => field);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

const typeErrors = Object.entries(requiredFields)
.filter(([field, type]) => {
  if (type === 'array') {
    return !Array.isArray(convertedBody[field]);
  }
  return typeof convertedBody[field] !== type;
})
.map(([field]) => `${field} must be ${requiredFields[field]}`);
    if (typeErrors.length > 0) {
      return res.status(400).json({
        message: `Type errors: ${typeErrors.join(', ')}`
      });
    }

    const newProperty = new Property({
      ...convertedBody,
      user_id: req.user._id,
      status: "pending",
    });

    const savedProperty = await newProperty.save();
    res.status(201).json(savedProperty);

  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({
      message: 'Error creating property',
      error: error.message
    });
  }
});

router.get('/save-listings', authMiddleware, async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).populate('saved_listings');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.saved_listings);
  } catch (error) {
    console.error('Error fetching saved listings:', error);
    res.status(500).json({ message: 'Error fetching saved listings', error: error.message });
  }
});
router.get('/my-listings', authMiddleware, async (req, res) => {
  try {
    const user_id = req.user._id; 
    const properties = await Property.find({ user_id });
    res.status(200).json(properties);
  } catch (error) {
    console.error('Error fetching user listings:', error);
    res.status(500).json({ message: 'Error fetching user listings' });
  }
});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
// Add these new routes

// Like/Dislike property
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const userId = req.user._id;
    const hasLiked = property.likes.some(like => like.userId.equals(userId));
    const hasDisliked = property.dislikes.some(dislike => dislike.userId.equals(userId));

    if (hasLiked) {
      // Remove like
      property.likes = property.likes.filter(like => !like.userId.equals(userId));
      property.likeCount -= 1;
    } else {
      // Add like
      property.likes.push({ userId });
      property.likeCount += 1;
      
      // Remove dislike if exists
      if (hasDisliked) {
        property.dislikes = property.dislikes.filter(dislike => !dislike.userId.equals(userId));
        property.dislikeCount -= 1;
      }
    }

    await property.save();

    // Check if property is trending (top 5)
    const topProperties = await Property.find()
      .sort({ likeCount: -1 })
      .limit(5);
    
    const isTrending = topProperties.some(p => p._id.equals(property._id));
    
    if (isTrending) {
      // Create notification for all users
      const users = await userModel.find();
      await Promise.all(users.map(async user => {
        if (!user._id.equals(userId)) {
          await Notification.create({
            userId: user._id,
            propertyId: property._id,
            message: `This property "${property.title}" is trending!`
          });
        }
      }));
    }

    res.status(200).json(property);
  } catch (error) {
    console.error('Error liking property:', error);
    res.status(500).json({ message: 'Error liking property' });
  }
});

router.post('/:id/dislike', authMiddleware, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const userId = req.user._id;
    const hasDisliked = property.dislikes.some(dislike => dislike.userId.equals(userId));
    const hasLiked = property.likes.some(like => like.userId.equals(userId));

    if (hasDisliked) {
     
      property.dislikes = property.dislikes.filter(dislike => !dislike.userId.equals(userId));
      property.dislikeCount -= 1;
    } else {
    
      property.dislikes.push({ userId });
      property.dislikeCount += 1;
      
    
      if (hasLiked) {
        property.likes = property.likes.filter(like => !like.userId.equals(userId));
        property.likeCount -= 1;
      }
    }

    await property.save();
    res.status(200).json(property);
  } catch (error) {
    console.error('Error disliking property:', error);
    res.status(500).json({ message: 'Error disliking property' });
  }
});
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

router.post('/upload',authMiddleware, upload.array('images'), async (req, res) => {
  try {
    const urls = req.files.map(file => 
      `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
    );
    res.status(200).json({ urls });
  } catch (error) {
    res.status(500).json({ message: 'File upload failed' });
  }
});



router.post('/save-listing', authMiddleware, async (req, res) => {
  try {
    const { listingId } = req.body;

    if (!listingId || !mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({ message: 'Invalid listing ID' });
    }

    const user = await userModel.findById(req.user._id);
    if (!user.saved_listings.includes(listingId)) {
      user.saved_listings.push(listingId);
      await user.save();
    }
  

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.saved_listings) {
      user.saved_listings = [];
    }

   
    const property = await Property.findById(listingId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (!user.saved_listings.includes(listingId)) {
      user.saved_listings.push(listingId);
      await user.save();
    }

    res.status(200).json({ message: 'Listing saved successfully', savedListings: user.saved_listings });
  } catch (error) {
    console.error('Error saving listing:', error);
    res.status(500).json({ message: 'Error saving listing', error: error.message });
  }
});

router.post('/unsave-listing', authMiddleware, async (req, res) => {
  const { listingId } = req.body;

  if (!listingId || !mongoose.Types.ObjectId.isValid(listingId)) {
    return res.status(400).json({ message: 'Invalid listing ID' });
  }

  try {
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User  not found' });
    }

    user.saved_listings = user.saved_listings.filter(id => id.toString() !== listingId);
    await user.save();

    res.status(200).json({ message: 'Listing unsaved successfully', savedListings: user.saved_listings });
  } catch (error) {
    console.error('Error unsaving listing:', error);
    res.status(500).json({ message: 'Error unsaving listing', error: error.message });
  }
});



router.get('/user/liked', authMiddleware, async (req, res) => {
  try {
    const user_id = req.user._id;
    const likedProperties = await Property.find({ likes: user_id });
    res.status(200).json(likedProperties);
  } catch (error) {
    console.error('Error fetching liked properties:', error);
    res.status(500).json({ message: 'Error fetching liked properties', error: error.message });
  }
});


router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (!updates.sqfeet || isNaN(updates.sqfeet)) {
      return res.status(400).json({ message: 'Valid sqfeet is required' });
    }

    updates.sqfeet = parseFloat(updates.sqfeet);

  
    delete updates._id;
    delete updates.user_id;
    delete updates.createdAt;
    delete updates.updatedAt;
    
    if (req.body.location) {
      const lat = parseFloat(req.body.location.latitude);
      const lng = parseFloat(req.body.location.longitude);
      
      if (isNaN(lat) || lat < -90 || lat > 90) {
        return res.status(400).json({ 
          message: 'Invalid latitude - must be between -90 and 90'
        });
      }

      if (isNaN(lng) || lng < -180 || lng > 180) {
        return res.status(400).json({ 
          message: 'Invalid longitude - must be between -180 and 180'
        });
      }
    }



    const numericFields = ['price', 'bedrooms', 'bathrooms'];
    numericFields.forEach(field => {
      if (updates[field]) updates[field] = parseFloat(updates[field]);
    });

    if (updates.location) {
      updates.location = {
        address: updates.location.address,
        latitude: parseFloat(updates.location.latitude),
        longitude: parseFloat(updates.location.longitude)
      };
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedProperty) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.status(200).json(updatedProperty);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ 
      message: 'Error updating property',
      error: error.message
    });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ message: 'Error deleting property' });
  }
});


router.put('/:id/approve', authMiddleware, async (req, res) => {
  try {
    const listingId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({ message: 'Invalid listing ID' });
    }

    const updatedListing = await Property.findByIdAndUpdate(
      listingId,
      { status: 'approved' },
      { new: true }
    );

    if (!updatedListing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.status(200).json({ message: 'Listing approved successfully', listing: updatedListing });
  } catch (error) {
    console.error('Error approving listing:', error);
    res.status(500).json({ message: 'Error approving listing', error: error.message });
  }
});

router.put('/:id/reject', authMiddleware, async (req, res) => {
  try {
    const listingId = req.params.id;

  
    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({ message: 'Invalid listing ID' });
    }


    const updatedListing = await Property.findByIdAndUpdate(
      listingId,
      { status: 'rejected' },
      { new: true }
    );

    if (!updatedListing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.status(200).json({ message: 'Listing rejected successfully', listing: updatedListing });
  } catch (error) {
    console.error('Error rejecting listing:', error);
    res.status(500).json({ message: 'Error rejecting listing', error: error.message });
  }
});


router.get("/filter-by-rating", async (req, res) => {
  try {
    const { minRating } = req.query;
    console.log("Received minRating:", minRating); 

    
    if (!minRating || isNaN(minRating)) {
      return res.status(400).json({ message: "Invalid minimum rating" });
    }

 
    const properties = await Property.find({
      "rating.average_rating": { $gte: parseFloat(minRating) },
    })
      .populate({
        path: "user_id",
        match: { status: "active" }, 
        select: "email",
      })
      .exec();

    
    const filteredProperties = properties.filter((property) => property.user_id !== null);

    res.status(200).json(filteredProperties);
  } catch (error) {
    console.error("Error fetching properties by rating:", error);
    res.status(500).json({ message: "Error fetching properties by rating" });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('user_id', 'name avatar')
      .populate({
        path: 'reviews.user_id',
        select: 'name avatar',
        model: 'User'
      }); 

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ message: 'Error fetching property' });
  }
});
router.post('/:id/reviews', authMiddleware, async (req, res) => {
  try {
    const { review, rating } = req.body;
    const user_id = req.user._id;
    
    if (!review?.trim() || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Valid review and rating (1-5) required' });
    }

  
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const newReview = {
      user_id: user_id, 
      review: review.trim(),
      rating: Number(rating),
      timestamp: new Date(), 
    };

    property.reviews.push(newReview);

    const totalReviews = property.reviews.length;
    const totalRating = property.reviews.reduce((sum, r) => sum + r.rating, 0);
    property.rating = {
      average_rating: totalRating / totalReviews,
      total_reviews: totalReviews,
    };

    await property.save();

    res.status(201).json(newReview);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id/reviews', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('reviews.user_id', 'name avatar');
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json(property.reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
module.exports = router;