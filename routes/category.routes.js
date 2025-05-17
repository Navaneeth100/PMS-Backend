import express from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  createSubCategory,
  getAllSubCategories,
  getSubCategoriesByCategory,
  updateSubCategory,
  deleteSubCategory
} from '../controllers/category.controller.js';
import { authenticate, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Category routes
router.post('/', authenticate, isAdmin, createCategory);
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.put('/:id', authenticate, isAdmin, updateCategory);
router.delete('/:id', authenticate, isAdmin, deleteCategory);

// Subcategory routes
router.post('/sub', authenticate, isAdmin, createSubCategory);
router.get('/sub/all', getAllSubCategories);
router.get('/sub/:categoryId', getSubCategoriesByCategory);
router.put('/sub/:id', authenticate, isAdmin, updateSubCategory);
router.delete('/sub/:id', authenticate, isAdmin, deleteSubCategory);

export default router;