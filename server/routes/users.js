const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Session = require('../models/Session');
const Question = require('../models/Question');
const Evaluation = require('../models/Evaluation');

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

/**
 * DELETE /api/users
 * Deletes user profile, sessions, questions, and evaluations.
 */
router.delete('/', async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: No userId found in token' });
    }

    // 1. Find all sessions belonging to the user
    const sessions = await Session.find({ userId });
    const sessionIds = sessions.map(s => s._id);

    // 2. Cascade delete evaluations associated with these sessions
    await Evaluation.deleteMany({ sessionId: { $in: sessionIds } });

    // 3. Cascade delete questions associated with these sessions
    await Question.deleteMany({ sessionId: { $in: sessionIds } });

    // 4. Delete the sessions themselves
    await Session.deleteMany({ userId });

    // 5. Delete the user profile document
    await User.findOneAndDelete({ userId });

    res.json({ 
      success: true, 
      message: 'User account and all associated practice data have been permanently deleted.' 
    });
  } catch (err) {
    console.error('Account deletion error:', err);
    res.status(500).json({ error: 'Failed to delete account and data' });
  }
});

module.exports = router;

