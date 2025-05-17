import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js';
import { authenticate, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Create a new product
router.post('/', authenticate, isAdmin, createProduct);

// Get all products with pagination and filtering
router.get('/', getAllProducts);

// Get product by ID
router.get('/:id', getProductById);

// Update product
router.put('/:id', authenticate, isAdmin, updateProduct);

// Delete product
router.delete('/:id', authenticate, isAdmin, deleteProduct);

export default router;