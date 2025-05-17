import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

// Add product to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find user's wishlist or create a new one
    let wishlist = await Wishlist.findOne({ user: userId });
    
    if (!wishlist) {
      wishlist = new Wishlist({
        user: userId,
        products: [productId]
      });
    } else {
      // Check if product is already in wishlist
      if (wishlist.products.includes(productId)) {
        return res.status(400).json({ message: 'Product already in wishlist' });
      }
      
      // Add product to wishlist
      wishlist.products.push(productId);
    }

    await wishlist.save();

    res.status(200).json({
      message: 'Product added to wishlist',
      wishlist
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    
    const wishlist = await Wishlist.findOne({ user: userId })
      .populate({
        path: 'products',
        populate: [
          { path: 'category', select: 'name' },
          { path: 'subCategory', select: 'name' }
        ]
      });
    
    if (!wishlist) {
      return res.status(200).json({ products: [] });
    }
    
    res.status(200).json({ products: wishlist.products });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.userId;
    
    const wishlist = await Wishlist.findOne({ user: userId });
    
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }
    
    // Remove product from wishlist
    wishlist.products = wishlist.products.filter(
      product => product.toString() !== productId
    );
    
    await wishlist.save();
    
    res.status(200).json({
      message: 'Product removed from wishlist',
      wishlist
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Clear wishlist
export const clearWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    
    const wishlist = await Wishlist.findOne({ user: userId });
    
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }
    
    // Clear products array
    wishlist.products = [];
    
    await wishlist.save();
    
    res.status(200).json({
      message: 'Wishlist cleared',
      wishlist
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};