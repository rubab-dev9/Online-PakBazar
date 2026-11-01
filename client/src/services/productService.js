import api from '../auth/Services/api';

const productService = {
    // Get all products
    getAllProducts: async () => {
        try {
            const { data } = await api.get('/products');
            return { success: true, products: data.products };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Failed to fetch products' 
            };
        }
    },

    // Get single product
    getProductById: async (id) => {
        try {
            const { data } = await api.get(`/products/${id}`);
            return { success: true, product: data.product };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Failed to fetch product' 
            };
        }
    },

    // Create product (Supplier only)
    createProduct: async (productData) => {
        try {
            const { data } = await api.post('/products/add', productData);
            return { success: true, product: data.product };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Failed to create product' 
            };
        }
    },

    // Update product
    updateProduct: async (id, productData) => {
        try {
            const { data } = await api.put(`/products/${id}`, productData);
            return { success: true, product: data.product };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Failed to update product' 
            };
        }
    },

    // Delete product
    deleteProduct: async (id) => {
        try {
            await api.delete(`/products/${id}`);
            return { success: true, message: 'Product deleted successfully' };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Failed to delete product' 
            };
        }
    },

    // Get supplier products
    getSupplierProducts: async () => {
        try {
            const { data } = await api.get('/products/supplier/my-products');
            return { success: true, products: data.products };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Failed to fetch products' 
            };
        }
    },

    // Wishlist methods
    getWishlist: async () => {
        try {
            const response = await api.get('/wishlist');
            return {
                success: true,
                wishlist: response.data.wishlist || []
            };
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch wishlist',
                wishlist: []
            };
        }
    },

    addToWishlist: async (productId) => {
        try {
            const response = await api.post('/wishlist/add', { productId });
            return {
                success: true,
                message: 'Product added to wishlist',
                wishlist: response.data.wishlist
            };
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to add to wishlist'
            };
        }
    },

    removeFromWishlist: async (productId) => {
        try {
            const response = await api.delete(`/wishlist/remove/${productId}`);
            return {
                success: true,
                message: 'Product removed from wishlist',
                wishlist: response.data.wishlist
            };
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to remove from wishlist'
            };
        }
    },

    clearWishlist: async () => {
        try {
            const response = await api.delete('/wishlist/clear');
            return {
                success: true,
                message: 'Wishlist cleared successfully'
            };
        } catch (error) {
            console.error('Error clearing wishlist:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to clear wishlist'
            };
        }
    },

    syncWishlist: async (guestWishlist) => {
        try {
            const response = await api.post('/wishlist/sync', { items: guestWishlist });
            return {
                success: true,
                message: 'Wishlist synced successfully',
                wishlist: response.data.wishlist
            };
        } catch (error) {
            console.error('Error syncing wishlist:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to sync wishlist'
            };
        }
    }
};

export default productService;