const express = require('express');
const router = express.Router();
const User = require('../models/User');

/**
 * POST /api/users/sync
 * Syncs user data from Clerk to MongoDB. 
 * Prevents duplicates by using userId as a unique key.
 */
router.post('/sync', async (req, res) => {
  try {
    const { email, firstName, lastName, imageUrl } = req.body;
    const userId = req.userId; // Extracted from Clerk token by auth middleware

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: No userId found in token' });
    }

    // Upsert user: Update if exists, Create if not
    const user = await User.findOneAndUpdate(
      { userId },
      { 
        email, 
        firstName, 
        lastName, 
        imageUrl,
        lastLogin: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, user });
  } catch (err) {
    console.error('User sync error:', err);
    res.status(500).json({ error: 'Failed to sync user data' });
  }
});

module.exports = router;
