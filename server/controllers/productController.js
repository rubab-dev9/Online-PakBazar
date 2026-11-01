const Product = require("../models/Product");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

const createProduct = catchAsyncErrors(async (req, res, next) => {
  const { name, description, price, category, stock, images } = req.body;

  if (!name || !description || !price || !category) {
    return next(new ErrorHandler("All required fields must be filled", 400));
  }

  const product = await Product.create({
    name,
    description,
    price,
    category,
    stock,
    images,
    supplier: req.user._id,
  });

  res.status(201).json({
    success: true,
    product,
  });
});

const getAllProducts = catchAsyncErrors(async (req, res) => {
  const products = await Product.find().populate("supplier", "name email");

  res.status(200).json({
    success: true,
    products,
  });
});

const getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate(
    "supplier",
    "name email"
  );

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Add to your productController.js
const updateProduct = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { name, description, price, category, stock, images } = req.body;

  let product = await Product.findById(id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Check if user is the supplier who created the product or admin
  if (product.supplier.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new ErrorHandler("You are not authorized to update this product", 403));
  }

  product = await Product.findByIdAndUpdate(
    id,
    {
      name,
      description,
      price,
      category,
      stock,
      images,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    product,
  });
});

// Add to your productController.js
const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Check if user is the supplier who created the product or admin
  if (product.supplier.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new ErrorHandler("You are not authorized to delete this product", 403));
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

// Add to your productController.js
const getSupplierProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find({ supplier: req.user._id }).populate("supplier", "name email");

  res.status(200).json({
    success: true,
    products,
  });
});

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,     
  deleteProduct,      
  getSupplierProducts 
};