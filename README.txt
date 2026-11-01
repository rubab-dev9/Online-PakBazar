# Online PakBazar – E-Commerce Platform

## Final Year Project (FYP)

---

## Project Overview

Online PakBazar is a **fully functional web-based digital marketplace** that connects suppliers and customers under the supervision of an admin. The platform provides a complete e-commerce solution where suppliers can upload and manage their products, customers can browse and purchase them, and the admin can manage the overall platform. The system supports three distinct user roles with role-based dashboards, real-time order tracking, ratings and reviews, and secure authentication.

This application aims to promote local businesses, simplify the buying/selling process, and ensure secure transactions in an online environment.

---

## Technologies Used

### Frontend

| Technology | Purpose |
|------------|---------|
| React.js | UI Framework |
| React Router DOM | Navigation |
| React Bootstrap | UI Components (v5) |
| React Icons | Icons Library |
| Axios | HTTP Requests |
| React Toastify | Toast Notifications |
| CSS3 | Custom Styling |

### Backend

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime Environment |
| Express.js | Web Framework |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| Nodemailer | Email Service |

### Database

| Technology | Purpose |
|------------|---------|
| MongoDB | NoSQL Database |
| Mongoose | ODM (Object Data Modeling) |
| MongoDB Compass | Database GUI |

### Development Tools

| Tool | Purpose |
|------|---------|
| Visual Studio Code | Code Editor |
| Postman | API Testing |
| Git & GitHub | Version Control |
| Google Docs | Documentation |
| Google Slides | Presentation |

---

## Implemented Functionalities 

### 1. User Authentication & Profile Management

- User Registration with email verification (OTP)
- User Login with JWT token
- Role-based Access (Admin, Supplier, Customer)
- Profile Management (Update profile, change password)
- Forgot/Reset Password functionality

### 2. Product Management

- Suppliers can Add/Edit/Delete products
- Products include: name, description, price, category, stock, images
- Product Categories: Grocery, Electronics, Home Essentials, Fashion
- Stock management (In-stock, Low-stock, Out-of-stock)
- Product images upload (base64 with compression)

### 3. Search & Filter Products

- Search by product name, category, description
- Filter by category
- Filter by price range
- Sort by newest, price low-high, price high-low

### 4. Shopping Cart

- Add/Remove items to cart
- Update product quantities
- Cart total calculation
- Cart count badge in navbar

### 5. Wishlist

- Add/Remove products to wishlist
- Persistent storage (localStorage for guests, database for logged-in users)
- Wishlist count badge in navbar

### 6. Order Management

- Place orders with Cash on Delivery (COD)
- Unique order ID generation
- Real-time order tracking (auto-refresh every 30 seconds)
- Order status: Pending → Processing → Shipped → Delivered → Cancelled
- View order history (My Orders)
- Cancel pending orders

### 7. Payment Integration

- Cash on Delivery (COD) payment method
- Payment status tracking

### 8. Ratings & Reviews

- Customers can rate products (1-5 stars)
- Write reviews with title and comment
- Suppliers can reply to customer reviews
- Mark reviews as "Helpful"
- Average rating display on product cards

### 9. Admin Dashboard

- Dashboard statistics (Users, Suppliers, Products, Orders, Revenue)
- Manage all users (View, Delete)
- Approve pending suppliers
- Manage all products
- Manage all orders (Update status)
- View contact messages and reply

### 10. Supplier Dashboard

- Dashboard statistics (Products, Orders, Revenue, Average Rating)
- Manage products (Add/Edit/Delete)
- View orders of their products
- Update order status
- View product reviews and reply
- View top selling products

### 11. Additional Pages

- About Us Page
- Contact Us Page (with email sending)
- FAQs Page
- Profile Page

### 12. Notifications

- Toast notifications for all user actions
- Email notifications (OTP verification, Contact form replies)

### 13. Security Features

- JWT token-based authentication
- Password hashing (bcryptjs, 10 rounds)
- Role-based access control (RBAC)
- Protected routes and API endpoints
- CORS configuration

### 14. Responsive Design

- Mobile, tablet, and desktop responsive
- Modern gradient buttons and cards
- Loading skeletons for better UX
- Sticky navigation bar

---

## System Architecture


---

## Database Collections

| Collection | Description |
|------------|-------------|
| users | User information (name, email, password, role, isApproved) |
| products | Product details (name, price, category, stock, images, supplier) |
| orders | Order information (orderId, items, totalAmount, status, shippingAddress) |
| reviews | Product reviews (rating, title, comment, user, product, supplierReply) |
| wishlist | User wishlist items |
| contact | Contact form messages (name, email, subject, message, status) |
| otp | OTP codes for email verification |

---

## API Endpoints Summary

### Public Endpoints (53 Total APIs)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | User registration |
| POST | `/auth/verify-otp` | Verify email OTP |
| POST | `/auth/login` | User login |
| GET | `/products` | Get all products |
| GET | `/products/:id` | Get single product |
| POST | `/contact/send` | Send contact message |

### Customer Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders/create` | Create new order |
| GET | `/orders/my-orders` | Get my orders |
| POST | `/reviews/add` | Add product review |
| GET | `/wishlist` | Get wishlist |
| POST | `/wishlist/add` | Add to wishlist |

### Supplier Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/products/add` | Add new product |
| GET | `/supplier/stats` | Dashboard statistics |
| GET | `/supplier/recent-orders` | Recent orders |
| PUT | `/supplier/reviews/:reviewId/reply` | Reply to review |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/stats` | Dashboard statistics |
| GET | `/admin/users` | Get all users |
| PUT | `/admin/approve-supplier/:id` | Approve supplier |
| GET | `/admin/messages` | Get contact messages |
| POST | `/admin/reply` | Reply to message |

---

## How to Run the Project

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

#### Step 1: Backend Setup
cd server
npm install

Create a .env file in the server folder:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=your_email@gmail.com
ADMIN_EMAIL=admin@pakbazar.com
FRONTEND_URI=http://localhost:5173

Run backend server:
npm run dev
# Server runs on http://localhost:5000

#### Step 2: Frontend Setup
cd client
npm install

Create a .env file in the client folder:
VITE_API_URL=http://localhost:5000

Run frontend server:
npm run dev
# Application runs on http://localhost:5173

Developed By
Umm e Rubab Fatima
VU ID: BC220401286
BS Software Engineering
Final Year Project – Online PakBazar

Supervisor
Muhammad Qamar Usman
Software Projects & Research Section
Department of Computer Sciences
Virtual University of Pakistan

© 2026 Online PakBazar – All Rights Reserved

