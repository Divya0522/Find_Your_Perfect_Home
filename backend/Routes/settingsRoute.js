
const express = require('express');
const router = express.Router();
const Setting = require('../Models/settingModel');

router.get('/', async (req, res) => {
  try {
    const settings = await Setting.find({});
    res.status(200).json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Error fetching settings' });
  }
});

router.put('/', async (req, res) => {
  try {
    const updatedSettings = req.body;

   
    for (const setting of updatedSettings) {
      await Setting.findOneAndUpdate(
        { name: setting.name },
        { value: setting.value },
        { upsert: true }
      );
    }

    res.status(200).json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Error updating settings' });
  }
});

module.exports = router;