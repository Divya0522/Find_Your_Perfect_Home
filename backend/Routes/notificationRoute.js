const express = require('express');
const router = express.Router();

const Notification=require("../Models/notifcationModel");
const authMiddleware=require("../middleware/authMiddleware");

router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'propertyId',
        select: 'title images',
        model: 'Property' 
      })
      .lean(); 

    const unreadCount = await Notification.countDocuments({
      userId: req.user._id,
      read: false
    });

  
    console.log('Sending notifications:', {
      notifications: notifications.map(n => ({
        _id: n._id,
        message: n.message,
        property: n.propertyId?.title || 'No property'
      })),
      unreadCount
    });

    res.status(200).json({ notifications, unreadCount });
  } catch (error) {
    console.error('Notification fetch error:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});


router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error marking notification as read', error: error.message });
  }
});

router.post('/test-notification', authMiddleware, async (req, res) => {
  try {
   
    const testNotification = await Notification.create({
      userId: req.user._id,
      propertyId: '65d8f5a9c4b9d1a9c8f5a9d1', 
      message: 'Test notification - please ignore'
    });
    
    res.status(201).json(testNotification);
  } catch (error) {
    console.error('Test notification error:', error);
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;