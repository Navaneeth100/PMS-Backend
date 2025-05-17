import express from 'express';
import { register, login, getCurrentUser } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Register a new user
router.post('/register', register);

// Login user
router.post('/login', login);

// Get current user
router.get('/me', authenticate, getCurrentUser);

export default router;