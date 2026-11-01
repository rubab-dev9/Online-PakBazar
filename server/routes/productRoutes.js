const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,     
  deleteProduct,      
  getSupplierProducts 
} = require("../controllers/productController");

const { protect, authorizeRole } = require("../middlewares/authMiddleware");

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);

// Supplier/Admin only routes
router.post("/add", protect, authorizeRole('supplier', 'admin'), createProduct);
router.put('/:id', protect, authorizeRole('supplier', 'admin'), updateProduct);
router.delete('/:id', protect, authorizeRole('supplier', 'admin'), deleteProduct);
router.get('/supplier/my-products', protect, authorizeRole('supplier'), getSupplierProducts);

module.exports = router;