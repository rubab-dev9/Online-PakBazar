import api from "../auth/Services/api";

const reviewService = {
    // Add review
    addReview: async (reviewData) => {
        try {
            const { data } = await api.post('/reviews/add', reviewData);
            return { success: true, review: data.review };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to add review'
            };
        }
    },

    // Get product reviews
    getProductReviews: async (productId) => {
        try {
            const { data } = await api.get(`/reviews/product/${productId}`);
            return {
                success: true,
                reviews: data.reviews,
                stats: data.stats
            };
        } catch (error) {
            return {
                success: false,
                reviews: [],
                stats: { total: 0, averageRating: 0, distribution: {} }
            };
        }
    },

    // Get my reviews
    getMyReviews: async () => {
        try {
            const { data } = await api.get('/reviews/my-reviews');
            return { success: true, reviews: data.reviews };
        } catch (error) {
            return { success: false, reviews: [] };
        }
    },

    // Update review
    updateReview: async (reviewId, reviewData) => {
        try {
            const { data } = await api.put(`/reviews/${reviewId}`, reviewData);
            return { success: true, review: data.review };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update review'
            };
        }
    },

    // Delete review
    deleteReview: async (reviewId) => {
        try {
            await api.delete(`/reviews/${reviewId}`);
            return { success: true, message: 'Review deleted successfully' };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to delete review'
            };
        }
    },

    // Mark review as helpful
    markHelpful: async (reviewId) => {
        try {
            const { data } = await api.put(`/reviews/${reviewId}/helpful`);
            return { success: true, helpfulCount: data.helpfulCount };
        } catch (error) {
            return { success: false };
        }
    }
};

export default reviewService;