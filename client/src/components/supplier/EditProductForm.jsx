import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import productService from '../../services/productService';
import { FaCloudUploadAlt, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import SupplierLayout from './SupplierLayout';
import '../../css/products.css';

const EditProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Grocery',
        stock: '',
        images: []
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        const result = await productService.getProductById(id);
        if (result.success) {
            const product = result.product;
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                stock: product.stock,
                images: product.images || []
            });
        } else {
            toast.error(result.message);
            navigate('/supplier/products');
        }
        setFetching(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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

        for (const file of files) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, reader.result]
                }));
            };
            reader.readAsDataURL(file);
        }
        toast.success(`${files.length} image(s) uploaded`);
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

        const result = await productService.updateProduct(id, productData);
        setLoading(false);

        if (result.success) {
            toast.success('Product updated successfully!');
            navigate('/supplier/products');
        } else {
            toast.error(result.message);
        }
    };

    if (fetching) {
        return (
            <SupplierLayout title="Edit product" subtitle="Manage your products">
                <Container className="py-5 text-center">
                    <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </Container>
            </SupplierLayout>

        );
    }

    return (
        <SupplierLayout title="Edit product" subtitle="Manage your products">
            <div className="supplier-dashboard">
                <Container fluid className="py-4">
                    <Row>
                        <Col lg={10} className="mx-auto">
                            <Card className="form-card fade-in">
                                <Card.Body className="p-4 p-lg-5">
                                    <div className="form-header mb-4">
                                        <h2 className="form-title">Edit Product</h2>
                                        <p className="form-subtitle">Update your product information</p>
                                    </div>

                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            <Col md={8}>
                                                <Form.Group className="mb-4">
                                                    <Form.Label className="form-label">Product Name *</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        isInvalid={!!errors.name}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.name}
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                <Form.Group className="mb-4">
                                                    <Form.Label className="form-label">Description *</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        name="description"
                                                        rows={5}
                                                        value={formData.description}
                                                        onChange={handleChange}
                                                        isInvalid={!!errors.description}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.description}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>

                                            <Col md={4}>
                                                <Form.Group className="mb-4">
                                                    <Form.Label className="form-label">Price (Rs.) *</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        name="price"
                                                        value={formData.price}
                                                        onChange={handleChange}
                                                        isInvalid={!!errors.price}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.price}
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                <Form.Group className="mb-4">
                                                    <Form.Label className="form-label">Stock Quantity *</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        name="stock"
                                                        value={formData.stock}
                                                        onChange={handleChange}
                                                        isInvalid={!!errors.stock}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.stock}
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                <Form.Group className="mb-4">
                                                    <Form.Label className="form-label">Category *</Form.Label>
                                                    <Form.Select
                                                        name="category"
                                                        value={formData.category}
                                                        onChange={handleChange}
                                                    >
                                                        <option value="Grocery">Grocery</option>
                                                        <option value="Electronics">Electronics</option>
                                                        <option value="Fashion">Fashion</option>
                                                        <option value="Home Essentials">Home Essentials</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        </Row>

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
                                                    <span>Click to upload more images</span>
                                                    <small>PNG, JPG up to 5MB (Max 5 images)</small>
                                                </label>
                                            </div>

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

                                        <div className="form-actions">
                                            <Button
                                                variant="secondary"
                                                onClick={() => navigate('/supplier/products')}
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
                                                {loading ? 'Updating...' : 'Update Product'}
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

export default EditProductForm;