import Category from '../models/Category.js';
import SubCategory from '../models/SubCategory.js';

// Create a new category
export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Check if category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        // Create new category
        const category = new Category({
            name,
            description
        });

        await category.save();

        res.status(201).json({
            message: 'Category created successfully',
            category
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all categories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get category by ID
export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update category
export const updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({
            message: 'Category updated successfully',
            category
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete category
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Delete all subcategories associated with this category
        await SubCategory.deleteMany({ category: req.params.id });

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create a new subcategory
export const createSubCategory = async (req, res) => {
    try {
        const { name, description, categoryId } = req.body;

        // Check if category exists
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Check if subcategory already exists in this category
        const existingSubCategory = await SubCategory.findOne({
            name,
            category: categoryId
        });

        if (existingSubCategory) {
            return res.status(400).json({ message: 'Subcategory already exists in this category' });
        }

        // Create new subcategory
        const subCategory = new SubCategory({
            name,
            description,
            category: categoryId
        });

        await subCategory.save();

        res.status(201).json({
            message: 'Subcategory created successfully',
            subCategory
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all subcategories
export const getAllSubCategories = async (req, res) => {
    try {
        const subCategories = await SubCategory.find()
            .populate('category', 'name')
            .sort({ name: 1 });

        res.status(200).json(subCategories);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get subcategories by category ID
export const getSubCategoriesByCategory = async (req, res) => {
    try {
        const subCategories = await SubCategory.find({ category: req.params.categoryId })
            .populate('category', 'name')
            .sort({ name: 1 });

        res.status(200).json(subCategories);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update subcategory
export const updateSubCategory = async (req, res) => {
    try {
        const { name, description, categoryId } = req.body;

        // Check if category exists if categoryId is provided
        if (categoryId) {
            const category = await Category.findById(categoryId);
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
        }

        const updateData = {
            ...(name && { name }),
            ...(description && { description }),
            ...(categoryId && { category: categoryId })
        };

        const subCategory = await SubCategory.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('category', 'name');

        if (!subCategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        res.status(200).json({
            message: 'Subcategory updated successfully',
            subCategory
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete subcategory
export const deleteSubCategory = async (req, res) => {
    try {
        const subCategory = await SubCategory.findByIdAndDelete(req.params.id);
        if (!subCategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        res.status(200).json({ message: 'Subcategory deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};