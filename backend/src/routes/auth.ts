import express from 'express';
import { User } from '../models/User';
import { Student } from '../models/Student';
import { generateToken, authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, userType, profile, studentId, classLevel, parentId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create user
    const user = new User({
      email: email.toLowerCase(),
      password,
      userType,
      profile
    });

    await user.save();

    // Create profile based on user type
    if (userType === 'student') {
      const student = new Student({
        user: user._id,
        studentId,
        classLevel,
        parentId: parentId || null
      });
      await student.save();
    }

    const token = generateToken(user._id as string);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        userType: user.userType,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: (error as Error).message });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id as string);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        userType: user.userType,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: (error as Error).message });
  }
});

// Get current user profile
router.get('/profile', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    let profileData = {
      id: req.user._id,
      email: req.user.email,
      userType: req.user.userType,
      profile: req.user.profile
    };

    // Get additional profile data based on user type
    if (req.user.userType === 'student') {
      const student = await Student.findOne({ user: req.user._id })
        .populate('grades')
        .populate('attendance');
      
      if (student) {
        profileData = { ...profileData, ...{ studentData: student } };
      }
    }

    res.json(profileData);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch profile', error: (error as Error).message });
  }
});

// Update profile
router.put('/profile', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const { profile } = req.body;

    req.user.profile = { ...req.user.profile, ...profile };
    await req.user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: req.user._id,
        email: req.user.email,
        userType: req.user.userType,
        profile: req.user.profile
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Failed to update profile', error: (error as Error).message });
  }
});

// Verify token endpoint
router.get('/verify', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    res.json({
      valid: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        userType: req.user.userType,
        profile: req.user.profile
      }
    });
  } catch (error) {
    res.status(401).json({ valid: false, message: 'Invalid token' });
  }
});

export default router;