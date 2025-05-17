import Product from '../models/Product.js';
import Category from '../models/Category.js';
import SubCategory from '../models/SubCategory.js';

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const { name, description, image, categoryId, subCategoryId, variants } = req.body;

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if subcategory exists and belongs to the category
    const subCategory = await SubCategory.findOne({ 
      _id: subCategoryId,
      category: categoryId
    });
    
    if (!subCategory) {
      return res.status(404).json({ message: 'Subcategory not found or does not belong to the specified category' });
    }

    // Validate variants
    if (!variants || variants.length === 0) {
      return res.status(400).json({ message: 'At least one variant is required' });
    }

    // Create new product
    const product = new Product({
      name,
      description,
      image: image || 'default-product.jpg',
      category: categoryId,
      subCategory: subCategoryId,
      variants
    });

    await product.save();

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all products with pagination
export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const query = {};
    
    // Filter by category if provided
    if (req.query.categoryId) {
      query.category = req.query.categoryId;
    }
    
    // Filter by subcategory if provided
    if (req.query.subCategoryId) {
      query.subCategory = req.query.subCategoryId;
    }
    
    // Search by name if provided
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }
    
    const products = await Product.find(query)
      .populate('category', 'name')
      .populate('subCategory', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Product.countDocuments(query);
    
    res.status(200).json({
      products,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate('subCategory', 'name');
      
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { name, description, image, categoryId, subCategoryId, variants } = req.body;
    
    // Check if category exists if categoryId is provided
    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
    }
    
    // Check if subcategory exists and belongs to the category if both are provided
    if (categoryId && subCategoryId) {
      const subCategory = await SubCategory.findOne({ 
        _id: subCategoryId,
        category: categoryId
      });
      
      if (!subCategory) {
        return res.status(404).json({ message: 'Subcategory not found or does not belong to the specified category' });
      }
    } else if (subCategoryId) {
      // If only subCategoryId is provided, check if it exists
      const subCategory = await SubCategory.findById(subCategoryId);
      if (!subCategory) {
        return res.status(404).json({ message: 'Subcategory not found' });
      }
    }
    
    // Validate variants if provided
    if (variants && variants.length === 0) {
      return res.status(400).json({ message: 'At least one variant is required' });
    }
    
    const updateData = {
      ...(name && { name }),
      ...(description && { description }),
      ...(image && { image }),
      ...(categoryId && { category: categoryId }),
      ...(subCategoryId && { subCategory: subCategoryId }),
      ...(variants && { variants })
    };
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('category', 'name')
    .populate('subCategory', 'name');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};