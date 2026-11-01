import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';
import productService from '../../services/productService';
import { FaCloudUploadAlt, FaTrash, FaImage } from 'react-icons/fa';
import { toast } from 'react-toastify';
import SupplierLayout from './SupplierLayout';
import '../../css/products.css';

const AddProductForm = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Grocery',
        stock: '',
        images: []
    });
    const [errors, setErrors] = useState({});

    const categories = ['Grocery', 'Electronics', 'Fashion', 'Home Essentials'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length + formData.images.length > 5) {
            toast.error('Maximum 5 images allowed');
            return;
        }

        // Simulate image upload (replace with actual upload API)
        for (const file of files) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, reader.result]
                }));
                setUploadProgress(prev => prev + (100 / files.length));
            };
            reader.readAsDataURL(file);
        }

        setTimeout(() => {
            setUploadProgress(0);
            toast.success(`${files.length} image(s) uploaded successfully`);
        }, 1000);
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Product name is required';
        if (formData.name.length < 3) newErrors.name = 'Name must be at least 3 characters';

        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (formData.description.length < 20) newErrors.description = 'Description must be at least 20 characters';

        if (!formData.price) newErrors.price = 'Price is required';
        if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';

        if (!formData.stock) newErrors.stock = 'Stock is required';
        if (formData.stock < 0) newErrors.stock = 'Stock cannot be negative';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setLoading(true);

        const productData = {
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock)
        };

        const result = await productService.createProduct(productData);

        setLoading(false);

        if (result.success) {
            toast.success('Product added successfully!');
            navigate('/supplier/products');
        } else {
            toast.error(result.message);
        }
    };

    return (
        <SupplierLayout title="Add Product" subtitle="Manage your products">
            <div className="supplier-dashboard">
                <Container fluid className="py-4">
                    <Row>
                        <Col lg={10} className="mx-auto">
                            <Card className="form-card fade-in">
                                <Card.Body className="p-4 p-lg-5">
                                    <div className="form-header mb-4">
                                        <h2 className="form-title">Add New Product</h2>
                                        <p className="form-subtitle">
                                            Fill in the details below to list your product on PakBazar
                                        </p>
                                    </div>

                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            <Col md={8}>
                                                {/* Product Name */}
                                                <Form.Group className="mb-4">
                                                    <Form.Label className="form-label">Product Name *</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="name"
                                                        placeholder="Enter product name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        isInvalid={!!errors.name}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.name}
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                {/* Description */}
                                                <Form.Group className="mb-4">
                                                    <Form.Label className="form-label">Description *</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        name="description"
                                                        rows={5}
                                                        placeholder="Describe your product in detail..."
                                                        value={formData.description}
                                                        onChange={handleChange}
                                                        isInvalid={!!errors.description}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.description}
                                                    </Form.Control.Feedback>
                                                    <Form.Text className="text-muted">
                                                        Min 20 characters. Include key features and specifications.
                                                    </Form.Text>
                                                </Form.Group>
                                            </Col>

                                            <Col md={4}>
                                                {/* Price */}
                                                <Form.Group className="mb-4">
                                                    <Form.Label className="form-label">Price (Rs.) *</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        name="price"
                                                        placeholder="0"
                                                        value={formData.price}
                                                        onChange={handleChange}
                                                        isInvalid={!!errors.price}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.price}
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                {/* Stock */}
                                                <Form.Group className="mb-4">
                                                    <Form.Label className="form-label">Stock Quantity *</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        name="stock"
                                                        placeholder="0"
                                                        value={formData.stock}
                                                        onChange={handleChange}
                                                        isInvalid={!!errors.stock}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.stock}
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                {/* Category */}
                                                <Form.Group className="mb-4">
                                                    <Form.Label className="form-label">Category *</Form.Label>
                                                    <Form.Select
                                                        name="category"
                                                        value={formData.category}
                                                        onChange={handleChange}
                                                    >
                                                        {categories.map(cat => (
                                                            <option key={cat} value={cat}>{cat}</option>
                                                        ))}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        {/* Image Upload */}
                                        <Form.Group className="mb-4">
                                            <Form.Label className="form-label">Product Images</Form.Label>
                                            <div className="image-upload-area">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handleImageUpload}
                                                    className="image-input"
                                                    id="imageUpload"
                                                />
                                                <label htmlFor="imageUpload" className="upload-label">
                                                    <FaCloudUploadAlt className="upload-icon" />
                                                    <span>Click to upload images</span>
                                                    <small>PNG, JPG up to 5MB (Max 5 images)</small>
                                                </label>
                                            </div>

                                            {uploadProgress > 0 && uploadProgress < 100 && (
                                                <ProgressBar
                                                    now={uploadProgress}
                                                    className="mt-3"
                                                    variant="success"
                                                />
                                            )}

                                            {formData.images.length > 0 && (
                                                <div className="image-preview-grid mt-3">
                                                    {formData.images.map((img, index) => (
                                                        <div key={index} className="image-preview-item">
                                                            <img src={img} alt={`Preview ${index + 1}`} />
                                                            <button
                                                                type="button"
                                                                className="remove-image-btn"
                                                                onClick={() => removeImage(index)}
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </Form.Group>

                                        {/* Form Actions */}
                                        <div className="form-actions">
                                            <Button
                                                variant="secondary"
                                                onClick={() => navigate(-1)}
                                                className="me-2"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                variant="primary"
                                                disabled={loading}
                                                className="submit-btn"
                                            >
                                                {loading ? 'Adding Product...' : 'Add Product'}
                                            </Button>
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </SupplierLayout>
    );
};

export default AddProductForm;