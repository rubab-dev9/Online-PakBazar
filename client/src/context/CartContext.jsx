import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within CartProvider');
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [cartCount, setCartCount] = useState(0);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('pakbazar_cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);

    // Update localStorage when cart changes
    useEffect(() => {
        localStorage.setItem('pakbazar_cart', JSON.stringify(cartItems));
        updateCartSummary();
    }, [cartItems]);

    const updateCartSummary = () => {
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        setCartTotal(total);
        setCartCount(count);
    };

    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item._id === product._id);
            
            if (existingItem) {
                const newQuantity = existingItem.quantity + quantity;
                if (newQuantity > product.stock) {
                    toast.error(`Only ${product.stock} items available in stock`);
                    return prevItems;
                }
                
                toast.success(`Added ${quantity} more ${product.name} to cart`);
                return prevItems.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: newQuantity }
                        : item
                );
            }
            
            if (quantity > product.stock) {
                toast.error(`Only ${product.stock} items available`);
                return prevItems;
            }
            
            toast.success(`${product.name} added to cart`);
            return [...prevItems, { ...product, quantity }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(item => item._id !== productId));
        toast.info('Item removed from cart');
    };

    const updateQuantity = (productId, newQuantity) => {
        const product = cartItems.find(item => item._id === productId);
        if (product && newQuantity > product.stock) {
            toast.error(`Only ${product.stock} items available`);
            return;
        }
        
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }
        
        setCartItems(prev =>
            prev.map(item =>
                item._id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
        toast.info('Cart cleared');
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            cartTotal,
            cartCount,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};