import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Spinner, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBox, FaSearch, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { useAuth } from '../../auth/context/AuthContext';
import api from '../../auth/Services/api';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../css/admin-dashboard.css';

const AdminProducts = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const filtered = products.filter(p => 
            p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [searchTerm, products]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/products');
            setProducts(response.data.products || []);
            setFilteredProducts(response.data.products || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedProduct) return;
        try {
            await api.delete(`/admin/products/${selectedProduct._id}`);
            toast.success('Product deleted successfully');
            fetchProducts();
            setShowDeleteModal(false);
            setSelectedProduct(null);
        } catch (error) {
            toast.error('Failed to delete product');
        }
    };

    const getStockBadge = (stock) => {
        if (stock === 0) return <Badge bg="danger">Out of Stock</Badge>;
        if (stock < 10) return <Badge bg="warning">Low Stock ({stock})</Badge>;
        return <Badge bg="success">In Stock ({stock})</Badge>;
    };

    if (loading) {
        return (
            <AdminLayout title="Products" subtitle="Manage all products">
                <div className="dashboard-loader">
                    <Spinner animation="border" variant="success" size="lg" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Products" subtitle="Manage all products">
            <div className="search-filter-bar">
                <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by name, category or supplier..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input-custom"
                    />
                </div>
            </div>

            <Card className="dashboard-card">
                <div className="card-header">
                    <h5><FaBox /> All Products ({filteredProducts.length})</h5>
                </div>
                <div className="card-body">
                    {filteredProducts.length === 0 ? (
                        <div className="empty-state">
                            <p>No products found</p>
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
                                        <th>Supplier</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map(p => (
                                        <tr key={p._id}>
                                            <tr>
                                                <div className="product-cell">
                                                    <img src={p.images?.[0] || '/placeholder.jpg'} alt={p.name} />
                                                    <div>
                                                        <strong>{p.name}</strong>
                                                        <small>{p.description?.substring(0, 40)}...</small>
                                                    </div>
                                                </div>
                                            </tr>
                                            <td>{p.category}</td>
                                            <td>₹{p.price?.toLocaleString()}</td>
                                            <td>{getStockBadge(p.stock)}</td>
                                            <td>{p.supplier?.name}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <Link to={`/product/${p._id}`}>
                                                        <Button size="sm" variant="info"><FaEye /></Button>
                                                    </Link>
                                                    <Button 
                                                        size="sm" 
                                                        variant="danger"
                                                        onClick={() => {
                                                            setSelectedProduct(p);
                                                            setShowDeleteModal(true);
                                                        }}
                                                    >
                                                        <FaTrash />
                                                    </Button>
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
                <Modal.Body>
                    Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </AdminLayout>
    );
};

export default AdminProducts;