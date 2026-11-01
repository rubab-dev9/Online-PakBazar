import api from '../auth/Services/api';

const orderService = {
    // Create new order
    createOrder: async (orderData) => {
        try {
            const { data } = await api.post('/orders/create', orderData);
            return { success: true, order: data.order };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Failed to create order' 
            };
        }
    },

    // Get user's orders
    getMyOrders: async () => {
        try {
            const { data } = await api.get('/orders/my-orders');
            return { success: true, orders: data.orders };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Failed to fetch orders' 
            };
        }
    },

    // Get single order details
    getOrderDetails: async (orderId) => {
        try {
            const { data } = await api.get(`/orders/${orderId}`);
            return { success: true, order: data.order };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Failed to fetch order' 
            };
        }
    },

    // Cancel order
    cancelOrder: async (orderId) => {
        try {
            const { data } = await api.put(`/orders/${orderId}/cancel`);
            return { success: true, message: data.message };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Failed to cancel order' 
            };
        }
    }
};

export default orderService;