
const express = require('express');
const router = express.Router();
const userModel = require('../Models/userModel');
const Property = require('../Models/PropertyModel');
const Report = require('../Models/reportModel');
router.get('/users', async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

router.put('/users/:id/suspend', async (req, res) => {
  const { status } = req.body;
  try {
    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: `User status updated to ${status}` });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Error updating user status' });
  }
});

router.get('/listings', async (req, res) => {
  try {
    const listings = await Property.find({}).populate('user_id', 'email');
    res.status(200).json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ message: 'Error fetching listings' });
  }
});

router.put('/listings/:id/approve', async (req, res) => {
  const { status } = req.body;
  try {
    const listing = await Property.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.status(200).json({ message: `Listing status updated to ${status}` });
  } catch (error) {
    console.error('Error updating listing status:', error);
    res.status(500).json({ message: 'Error updating listing status' });
  }
});


router.get('/blocked-users', async (req, res) => {
  try {
    const blockedUsers = await userModel.find({ status: 'blocked' });
    res.status(200).json(blockedUsers);
  } catch (error) {
    console.error('Error fetching blocked users:', error);
    res.status(500).json({ message: 'Error fetching blocked users' });
  }
});

router.put('/users/:userId/status', async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = status;
    await user.save();

    res.status(200).json({ message: 'User status updated successfully', user });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Error updating user status' });
  }
});
router.put('/users/:userId/suspend', async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

  
    user.status = status;
    await user.save();

    res.status(200).json({ message: 'User status updated successfully', user });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Error updating user status' });
  }
});


router.get("/reports", async (req, res) => {
  try {
    const reports = await Report.find().populate("property_id", "title description"); // Populate property details
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

module.exports = router;