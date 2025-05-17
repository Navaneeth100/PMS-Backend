import mongoose from 'mongoose';

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }
}, { timestamps: true });

// Compound index to ensure unique subcategory names within a category
subCategorySchema.index({ name: 1, category: 1 }, { unique: true });

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

export default SubCategory;