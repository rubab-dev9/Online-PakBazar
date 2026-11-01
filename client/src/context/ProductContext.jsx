import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import productService from '../services/productService';
import { toast } from 'react-toastify';
import { useAuth } from '../auth/context/AuthContext';

const ProductContext = createContext();

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) throw new Error('useProducts must be used within ProductProvider');
    return context;
};

export const ProductProvider = ({ children }) => {
    const [allProducts, setAllProducts] = useState([]); // Store original products
    const [products, setProducts] = useState([]); // Filtered products
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const { isAuthenticated, user } = useAuth();
    
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        minPrice: '',
        maxPrice: '',
        sortBy: 'newest'
    });

    // Use ref to track initial load
    const isInitialLoad = useRef(true);
    const isFiltering = useRef(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    // Separate useEffect for filtering with debounce
    useEffect(() => {
        // Skip if no products or currently filtering
        if (allProducts.length === 0) return;
        
        // Debounce filter changes
        const timer = setTimeout(() => {
            applyFilters();
        }, 300);
        
        return () => clearTimeout(timer);
    }, [filters, allProducts]);

    // Load wishlist when user logs in or auth state changes
    useEffect(() => {
        if (isAuthenticated && user) {
            fetchWishlistFromBackend();
        } else {
            loadWishlistFromLocalStorage();
        }
    }, [isAuthenticated, user]);

    const fetchWishlistFromBackend = async () => {
        setWishlistLoading(true);
        try {
            const result = await productService.getWishlist();
            if (result.success) {
                setWishlistItems(result.wishlist);
                setWishlistCount(result.wishlist.length);
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setWishlistLoading(false);
        }
    };

    const loadWishlistFromLocalStorage = () => {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
            const items = JSON.parse(savedWishlist);
            setWishlistItems(items);
            setWishlistCount(items.length);
        } else {
            setWishlistItems([]);
            setWishlistCount(0);
        }
    };

    const saveWishlistToLocalStorage = (items) => {
        localStorage.setItem('wishlist', JSON.stringify(items));
        setWishlistItems(items);
        setWishlistCount(items.length);
    };

    const fetchProducts = async () => {
        setLoading(true);
        const result = await productService.getAllProducts();
        if (result.success) {
            setAllProducts(result.products);
            setProducts(result.products);
            const uniqueCategories = [...new Set(result.products.map(p => p.category))];
            setCategories(uniqueCategories);
        }
        setLoading(false);
    };

    // applyFilters as useCallback to prevent recreation
    const applyFilters = useCallback(() => {
        if (isFiltering.current) return;
        isFiltering.current = true;
        
        let filtered = [...allProducts];

        // Search filter - by name, category, description
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchLower) ||
                product.category.toLowerCase().includes(searchLower) ||
                (product.description && product.description.toLowerCase().includes(searchLower))
            );
        }

        // Category filter
        if (filters.category) {
            filtered = filtered.filter(product => product.category === filters.category);
        }

        // Price range filter
        if (filters.minPrice) {
            filtered = filtered.filter(product => product.price >= parseInt(filters.minPrice));
        }
        if (filters.maxPrice) {
            filtered = filtered.filter(product => product.price <= parseInt(filters.maxPrice));
        }

        // Sorting
        switch (filters.sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            default:
                break;
        }

        setProducts(filtered);
        isFiltering.current = false;
    }, [allProducts, filters.search, filters.category, filters.minPrice, filters.maxPrice, filters.sortBy]);

    // updateFilters with useCallback
    const updateFilters = useCallback((newFilters) => {
        setFilters(prev => {
            // Check if filters actually changed to prevent unnecessary updates
            const hasChanged = Object.keys(newFilters).some(key => 
                prev[key] !== newFilters[key]
            );
            if (!hasChanged) return prev;
            return { ...prev, ...newFilters };
        });
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({
            search: '',
            category: '',
            minPrice: '',
            maxPrice: '',
            sortBy: 'newest'
        });
    }, []);

    const getProductById = async (id) => {
        const result = await productService.getProductById(id);
        if (result.success) {
            return result.product;
        }
        return null;
    };

    const getProductsByCategory = (category) => {
        return allProducts.filter(product => product.category === category);
    };

    const getFeaturedProducts = () => {
        return allProducts.slice(0, 8);
    };

    // ============= WISHLIST FUNCTIONS =============

    const addToWishlist = async (product) => {
        if (isAuthenticated) {
            try {
                const result = await productService.addToWishlist(product._id);
                if (result.success) {
                    await fetchWishlistFromBackend();
                    toast.success(`${product.name} added to wishlist`);
                    return true;
                } else {
                    toast.error(result.message || 'Failed to add to wishlist');
                    return false;
                }
            } catch (error) {
                toast.error('Failed to add to wishlist');
                return false;
            }
        } else {
            const existingItem = wishlistItems.find(item => item._id === product._id);
            if (existingItem) {
                toast.info(`${product.name} is already in your wishlist`);
                return false;
            }
            const newWishlist = [...wishlistItems, product];
            saveWishlistToLocalStorage(newWishlist);
            toast.success(`${product.name} added to wishlist`);
            return true;
        }
    };

    const removeFromWishlist = async (productId) => {
        const product = wishlistItems.find(item => item._id === productId);
        
        if (isAuthenticated) {
            try {
                const result = await productService.removeFromWishlist(productId);
                if (result.success) {
                    await fetchWishlistFromBackend();
                    toast.info(`${product?.name || 'Product'} removed from wishlist`);
                    return true;
                } else {
                    toast.error(result.message || 'Failed to remove from wishlist');
                    return false;
                }
            } catch (error) {
                toast.error('Failed to remove from wishlist');
                return false;
            }
        } else {
            const newWishlist = wishlistItems.filter(item => item._id !== productId);
            saveWishlistToLocalStorage(newWishlist);
            toast.info(`${product?.name || 'Product'} removed from wishlist`);
            return true;
        }
    };

    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item._id === productId);
    };

    const clearWishlist = async () => {
        if (isAuthenticated) {
            try {
                const result = await productService.clearWishlist();
                if (result.success) {
                    await fetchWishlistFromBackend();
                    toast.info('Wishlist cleared');
                }
            } catch (error) {
                toast.error('Failed to clear wishlist');
            }
        } else {
            saveWishlistToLocalStorage([]);
            toast.info('Wishlist cleared');
        }
    };

    const refreshWishlist = async () => {
        if (isAuthenticated) {
            await fetchWishlistFromBackend();
        } else {
            loadWishlistFromLocalStorage();
        }
    };

    return (
        <ProductContext.Provider value={{
            // Product related
            products,          // This is filtered products
            allProducts,       // Original products
            categories,
            loading,
            filters,
            updateFilters,
            clearFilters,
            getProductById,
            getProductsByCategory,
            getFeaturedProducts,
            refreshProducts: fetchProducts,
            
            // Wishlist related
            wishlistItems,
            wishlistCount,
            wishlistLoading,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            clearWishlist,
            refreshWishlist
        }}>
            {children}
        </ProductContext.Provider>
    );
};