import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  ram: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  qty: {
    type: Number,
    required: true,
    min: 0
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    default: 'default-product.jpg'
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
    required: true
  },
  variants: {
    type: [variantSchema],
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'Product must have at least one variant'
    }
  }
}, { timestamps: true });

// Add text index for search functionality
productSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;