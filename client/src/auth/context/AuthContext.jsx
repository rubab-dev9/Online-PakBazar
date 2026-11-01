import { createContext, useContext, useEffect, useState } from "react";
import api from "../Services/api";

// Create Context
const AuthContext = createContext();

// Auth Context Provider Component
export const AuthContextProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState(null)


    useEffect(() => {
        // Check authentication on app load
        const checkAuth = async () => {
            try {
                const { data } = await api.get("/auth/me", {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                setUser(data.user)
                setIsAuthenticated(true)
                // console.log("loadUser fetched user →", data.user);
            } catch (error) {
                console.error("Auth check failed:", error)
                setIsAuthenticated(false)
                setUser(null)
                if (document.cookie.includes("token")) logout()
            } finally {
                setIsLoading(false)
            }
        }
        checkAuth()
    }, [])



    // Register function
    const register = async (user) => {
        try {
            const { data } = await api.post('/auth/register', user, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            return {
                success: true, data
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Signup Failed!'
            }
        }
    }

    // Login function
    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (data?.user) {
                setUser(data.user)
                setIsAuthenticated(true)
            }
            // if (data?.success) {
            //     await checkAuth()
            // }

            return {
                success: true,
                requiresOtp: !data?.user,
                user: data.user,
                message: data?.message
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login Failed!'
            }
        }
    }

    // Logout function
    const logout = async () => {
        try {
            await api.post('/auth/logout')
        } catch (error) {
            console.error('Logout failed:', error)
        } finally {
            setUser(null)
            setIsAuthenticated(false)
        }
    }

    // Verify OTP function
    const verifyOtp = async (email, otp) => {
        try {
            const { data } = await api.post('/auth/verify-otp', { email, otp });

            // Fetch authenticated user after OTP verification
            const userRes = await api.get('/auth/me', {
                withCredentials: true,
            });

            setUser(userRes.data.user);
            setIsAuthenticated(true);

            return {
                success: true,
                message: data.message,
                user: userRes.data.user
            };

        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'OTP verification failed!'
            };
        }
    };

    // Resend OTP function
    const resendOtp = async (email) => {
        try {
            const { data } = await api.post('/auth/resend-otp', { email });
            return {
                success: true,
                message: data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to resend OTP!'
            };
        }
    };

    // Forgot Password function
    const forgotPassword = async (email) => {
        try {
            const { data } = await api.post('/auth/forgot-password', { email });
            return {
                success: true,
                message: data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to send reset link!'
            };
        }
    };

    // Reset Password function
    const resetPassword = async (token, password, confirmPassword) => {
        try {
            const { data } = await api.put(`/auth/reset-password/${token}`, {
                password,
                confirmPassword
            });
            return {
                success: true,
                message: data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to reset password!'
            };
        }
    };

    // Update Password function
    const updatePassword = async (oldPassword, newPassword, confirmPassword) => {
        try {
            const { data } = await api.put('/auth/update-password', {
                oldPassword,
                newPassword,
                confirmPassword
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return {
                success: true,
                message: data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update password!'
            };
        }
    };

    const updateUser = (updatedUser) => {
        const cleanUser = {
            ...updatedUser,
            password: undefined
        };

        setUser(cleanUser);

        localStorage.setItem(
            "user",
            JSON.stringify(cleanUser)
        );
    };

    // Values provided to consumers
    const value = {
        user,
        setUser,
        isAuthenticated,
        isLoading,
        register,
        login,
        logout,
        verifyOtp,
        resendOtp,
        forgotPassword,
        resetPassword,
        updatePassword,
        updateUser
    }

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    )
}

// custom hook for easy access
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthContextProvider')
    }
    return context
}