import express from 'express';
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist
} from '../controllers/wishlist.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Add product to wishlist
router.post('/', authenticate, addToWishlist);

// Get user's wishlist
router.get('/', authenticate, getWishlist);

// Remove product from wishlist
router.delete('/:productId', authenticate, removeFromWishlist);

// Clear wishlist
router.delete('/', authenticate, clearWishlist);

export default router;