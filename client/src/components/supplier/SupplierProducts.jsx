import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Badge, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import productService from '../../services/productService';
import { toast } from 'react-toastify';
import SupplierLayout from './SupplierLayout';
import '../../css/supplier-dashboard.css';

const SupplierProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const result = await productService.getSupplierProducts();
        if (result.success) {
            setProducts(result.products);
        }
        setLoading(false);
    };

    const handleDeleteProduct = async () => {
        if (!selectedProduct) return;

        const result = await productService.deleteProduct(selectedProduct._id);
        if (result.success) {
            toast.success('Product deleted successfully');
            fetchProducts();
            setShowDeleteModal(false);
            setSelectedProduct(null);
        } else {
            toast.error(result.message);
        }
    };

    const getStockBadge = (stock) => {
        if (stock === 0) return <Badge bg="danger">Out of Stock</Badge>;
        if (stock < 10) return <Badge bg="warning">Low Stock ({stock})</Badge>;
        return <Badge bg="success">In Stock ({stock})</Badge>;
    };

    if (loading) {
        return (
            <SupplierLayout title="My Products" subtitle="Manage your product listings">
                <div className="text-center py-5">
                    <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </SupplierLayout>
        );
    }

    return (
        <SupplierLayout title="My Products" subtitle="Manage your product listings">
            <div className="dashboard-header-actions">
                <Link to="/supplier/add-product">
                    <Button className="add-product-btn">
                        <FaPlus /> Add New Product
                    </Button>
                </Link>
            </div>

            <Card className="dashboard-card">
                <div className="card-header">
                    <h5>All Products ({products.length})</h5>
                </div>
                <div className="card-body">
                    {products.length === 0 ? (
                        <div className="empty-state">
                            <h4>No products yet</h4>
                            <p>Start selling by adding your first product</p>
                            <Link to="/supplier/add-product">
                                <Button variant="primary">Add Product</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr key={product._id}>
                                            <td>
                                                <div className="product-cell">
                                                    <img src={product.images?.[0] || '/placeholder.jpg'} alt={product.name} />
                                                    <div>
                                                        <strong>{product.name}</strong>
                                                        <small>{product.description?.substring(0, 50)}...</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{product.category}</td>
                                            <td>₹{product.price.toLocaleString()}</td>
                                            <td>{getStockBadge(product.stock)}</td>
                                            <td className="actions-column">
                                                <div className="action-buttons">
                                                    <Link to={`/product/${product._id}`}>
                                                        <Button variant="info" size="sm"><FaEye /></Button>
                                                    </Link>
                                                    <Link to={`/supplier/edit-product/${product._id}`}>
                                                        <Button variant="warning" size="sm"><FaEdit /></Button>
                                                    </Link>
                                                    <Button variant="danger" size="sm" onClick={() => {
                                                        setSelectedProduct(product);
                                                        setShowDeleteModal(true);
                                                    }}><FaTrash /></Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </Card>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete "{selectedProduct?.name}"?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDeleteProduct}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </SupplierLayout>
    );
};

export default SupplierProducts;