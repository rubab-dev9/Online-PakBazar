# Online PakBazar

A full-stack **MERN-based multi-vendor e-commerce platform** developed as a **Final Year Project (FYP)** for Virtual University of Pakistan.

Online PakBazar connects suppliers and customers through a centralized digital marketplace, allowing suppliers to manage products and orders, customers to browse and purchase products, and administrators to manage the overall platform.

The platform provides role-based dashboards, secure authentication, product management, shopping cart, wishlist, order tracking, ratings and reviews, and email notifications.

---

## Project Overview

Online PakBazar is a web-based multi-vendor marketplace designed to simplify online buying and selling while supporting local businesses.

The application provides three different user roles:

* **Admin:** Manages users, suppliers, products, orders, and customer inquiries.
* **Supplier:** Manages products, processes orders, views customer reviews, and monitors business statistics.
* **Customer:** Browses products, manages a shopping cart and wishlist, places orders, tracks purchases, and submits product reviews.

The project focuses on:

* Multi-vendor e-commerce functionality
* Role-based authentication and authorization
* Separate dashboards for Admin, Supplier, and Customer
* Product listing and management
* Product search, filtering, and sorting
* Shopping cart and wishlist management
* Order placement and tracking
* Cash on Delivery (COD) payment
* Product ratings and reviews
* Email OTP verification
* Admin and supplier management systems
* Responsive user interface
* Secure API development

---

## Tech Stack

### Frontend

* **React.js** – UI development
* **React Router DOM** – Client-side routing
* **React Bootstrap (v5)** – UI components
* **React Icons** – Icon library
* **Axios** – HTTP requests and API integration
* **React Toastify** – Toast notifications
* **CSS3** – Custom styling

### Backend

* **Node.js** – JavaScript runtime environment
* **Express.js** – Backend framework
* **JWT (JSON Web Token)** – Authentication and authorization
* **bcryptjs** – Password hashing
* **Nodemailer** – Email services

### Database

* **MongoDB** – NoSQL database
* **Mongoose** – Object Data Modeling (ODM)
* **MongoDB Compass** – Database management GUI

### Development Tools

* **Visual Studio Code** – Code editor
* **Postman** – API testing
* **Git** – Version control
* **GitHub** – Source code management
* **Google Docs** – Project documentation
* **Google Slides** – Project presentation

---

## User Roles

The application supports three user roles, each with specific permissions and functionalities.

### Admin

The administrator has overall control of the marketplace.

Main responsibilities:

* View dashboard statistics
* View and manage all registered users
* Delete user accounts
* Approve pending supplier accounts
* Manage all products
* Manage all orders
* Update order statuses
* View customer contact messages
* Reply to customer inquiries
* Monitor platform revenue and activity

### Supplier

Suppliers can manage their own products and orders through a dedicated dashboard.

Main responsibilities:

* View supplier dashboard statistics
* Add new products
* Edit existing products
* Delete products
* Manage product stock
* View orders containing their products
* Update order statuses
* View customer product reviews
* Reply to customer reviews
* Monitor product ratings
* View top-selling products

### Customer

Customers can browse the marketplace and purchase products.

Main responsibilities:

* Register and verify email
* Login securely
* Browse available products
* Search and filter products
* Sort products by price and date
* Add products to shopping cart
* Update cart quantities
* Add products to wishlist
* Place orders using COD
* Track order status
* View order history
* Cancel pending orders
* Rate and review purchased products
* Mark reviews as helpful
* Manage personal profile

---

## Project Structure

The project is organized into separate frontend and backend directories to maintain a clean separation of concerns.

```text
Online-PakBazar/
│
├── client/
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── routes/
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── .env
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   │
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── .env
│
├── .gitignore
└── README.md
```

*Note: This is a representative structure. Actual folder and file names may vary depending on the implementation.*

---

## Main Features

### 1. Authentication & Profile Management

The application provides secure authentication and account management for all user roles.

Features include:

* User registration with email OTP verification
* User login using JWT authentication
* Role-based access control (Admin, Supplier, Customer)
* Profile information updates
* Change password functionality
* Forgot password functionality
* Reset password functionality

---

### 2. Product Management

Suppliers can manage their products through their dedicated dashboard.

Features include:

* Add new products
* Edit existing products
* Delete products
* Upload product images
* Product image compression using Base64 encoding
* Product descriptions and pricing
* Category assignment
* Stock quantity management

Product information includes:

* Product Name
* Description
* Price
* Category
* Stock Quantity
* Product Images
* Supplier Information

#### Product Categories

* Grocery
* Electronics
* Home Essentials
* Fashion

#### Stock Management

Products are categorized based on their availability:

* In Stock
* Low Stock
* Out of Stock

---

### 3. Product Search, Filtering & Sorting

The marketplace provides product discovery functionality to help customers find products easily.

Features include:

* Search by product name
* Search by category
* Search by description
* Filter by product category
* Filter by price range

#### Sorting Options

* Newest Arrivals
* Price: Low to High
* Price: High to Low

---

### 4. Shopping Cart

Customers can manage their selected products before placing an order.

Features include:

* Add products to cart
* Remove products from cart
* Increase or decrease product quantities
* Automatic cart total calculation
* Cart count badge in the navigation bar

---

### 5. Wishlist

The wishlist allows customers to save products for future purchases.

Features include:

* Add products to wishlist
* Remove products from wishlist
* Persistent wishlist storage
* LocalStorage support for guest users
* Database storage for authenticated users
* Wishlist count badge in the navigation bar

---

### 6. Order Management & Tracking

The application provides order management functionality for customers, suppliers, and administrators.

Features include:

* Place new orders
* Automatic unique order ID generation
* View order history
* Track order status
* Automatic order tracking refresh every 30 seconds
* Cancel pending orders
* Supplier order management
* Admin order management

#### Order Status Workflow

```text
Pending
   ↓
Processing
   ↓
Shipped
   ↓
Delivered
```

Orders can also be marked as:

* Cancelled

---

### 7. Payment Integration

The platform currently supports:

* Cash on Delivery (COD)
* Payment status tracking

---

### 8. Ratings & Reviews

Customers can share their feedback about products.

Features include:

* Product ratings from 1 to 5 stars
* Review title and comments
* Supplier replies to customer reviews
* Mark reviews as helpful
* Average rating display on product cards

---

### 9. Admin Dashboard

The admin dashboard provides centralized management of the marketplace.

#### Dashboard Statistics

* Total Users
* Total Suppliers
* Total Products
* Total Orders
* Total Revenue

#### Management Features

* View all registered users
* Delete users
* Approve pending suppliers
* Manage all products
* Manage all orders
* Update order statuses
* View contact messages
* Reply to customer inquiries

---

### 10. Supplier Dashboard

The supplier dashboard allows suppliers to monitor and manage their business activities.

#### Dashboard Statistics

* Total Products
* Total Orders
* Total Revenue
* Average Rating

#### Management Features

* Add, edit, and delete products
* View orders containing supplier products
* Update order statuses
* View customer reviews
* Reply to reviews
* View top-selling products

---

### 11. Contact & Email Notifications

The application includes a contact system and email notification functionality.

Features include:

* Contact form submission
* Contact message management
* Admin replies to customer messages
* Email notifications for contact form replies
* OTP email verification using Nodemailer

---

### 12. Responsive Design & User Experience

The frontend is designed to provide a consistent experience across different devices.

Supported screen sizes:

* Desktop
* Laptop
* Tablet
* Mobile devices

UI features include:

* Responsive layouts
* Modern gradient buttons and cards
* Sticky navigation bar
* Loading skeletons
* Toast notifications
* Interactive dashboard components
* Responsive product cards

---

## Database Collections

The application uses MongoDB to store and manage platform data.

| Collection | Description |
|---|---|
| `users` | User information, credentials, roles, and approval status |
| `products` | Product details, prices, categories, stock, images, and supplier references |
| `orders` | Order IDs, items, total amount, status, and shipping address |
| `reviews` | Product ratings, titles, comments, users, products, and supplier replies |
| `wishlist` | User wishlist items |
| `contact` | Contact form messages and reply status |
| `otp` | OTP codes for email verification |

---

## API Endpoints

The application includes **53 APIs** covering authentication, product management, customer operations, supplier functionality, and administration.

### Public Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/verify-otp` | Verify email OTP |
| POST | `/auth/login` | User login |
| GET | `/products` | Get all products |
| GET | `/products/:id` | Get a single product |
| POST | `/contact/send` | Submit contact message |

### Customer Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/orders/create` | Create a new order |
| GET | `/orders/my-orders` | Get customer orders |
| POST | `/reviews/add` | Add a product review |
| GET | `/wishlist` | Get customer wishlist |
| POST | `/wishlist/add` | Add product to wishlist |

### Supplier Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/products/add` | Add a new product |
| GET | `/supplier/stats` | Get supplier dashboard statistics |
| GET | `/supplier/recent-orders` | Get recent supplier orders |
| PUT | `/supplier/reviews/:reviewId/reply` | Reply to customer review |

### Admin Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/stats` | Get admin dashboard statistics |
| GET | `/admin/users` | Get all users |
| PUT | `/admin/approve-supplier/:id` | Approve supplier account |
| GET | `/admin/messages` | Get contact messages |
| POST | `/admin/reply` | Reply to contact message |

*Note: The above tables contain selected API endpoints. The complete application includes 53 APIs.*

---

## Security Features

Security is an important part of the application.

Implemented security features include:

* JWT-based authentication
* Password hashing using bcryptjs
* 10 salt rounds for password hashing
* Role-Based Access Control (RBAC)
* Protected frontend routes
* Protected backend API endpoints
* CORS configuration
* Secure password management

---

## Local Development

Follow the steps below to run Online PakBazar on your local machine.

### Prerequisites

Make sure the following tools are installed:

* Node.js (v14 or higher)
* MongoDB (Local installation or MongoDB Atlas)
* npm
* Git
* Visual Studio Code (Recommended)

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the Project

```bash
cd Online-PakBazar
```

### 3. Backend Setup

Navigate to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `server` directory and configure the environment variables.

### 4. Frontend Setup

Open a separate terminal and navigate to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `client` directory.

### 5. Run the Backend Server

From the `server` directory:

```bash
npm run dev
```

Backend server:

```text
http://localhost:5000
```

### 6. Run the Frontend Application

From the `client` directory:

```bash
npm run dev
```

Frontend application:

```text
http://localhost:5173
```

---

## Environment Variables

The application requires environment variables for database connectivity, authentication, email services, and API configuration.

### Backend Configuration

Create a `.env` file inside the `server` directory:

```env
PORT=5000

# Database
MONGO_URI=your_mongodb_connection_string

# JWT Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

FROM_EMAIL=your_email@gmail.com
ADMIN_EMAIL=admin@pakbazar.com

# Frontend URL
FRONTEND_URI=http://localhost:5173
```

### Frontend Configuration

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:5000
```

**Important:** Replace the placeholder values with your actual configuration. Never upload `.env` files, database credentials, email passwords, or JWT secrets to GitHub.

---

## Application URLs

After starting the development servers, the application will be available at:

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000 |

---

## Project Scope

Online PakBazar is a full-stack e-commerce application developed to demonstrate practical implementation of MERN Stack technologies.

### Included

* React-based frontend
* Node.js and Express.js backend
* MongoDB database integration
* User registration and authentication
* Email OTP verification
* Role-based access control
* Admin dashboard
* Supplier dashboard
* Product management
* Product search and filtering
* Shopping cart
* Wishlist
* Order management
* Order tracking
* Cash on Delivery
* Ratings and reviews
* Contact form and email notifications
* Responsive user interface
* Protected routes and API endpoints

---

## Future Improvements

Potential future enhancements include:

* Online payment gateway integration
* Real-time order tracking using Socket.IO
* Advanced product recommendations
* Product comparison functionality
* Advanced analytics and reporting
* Sales reports for suppliers
* Advanced notification system
* Improved product image storage using cloud services
* Enhanced admin analytics dashboard
* Promotional offers and discount coupons
* Advanced inventory management

---

## License

This project was developed for academic purposes as part of the Final Year Project (FYP) requirements at **Virtual University of Pakistan**.

© 2026 Online PakBazar – All Rights Reserved.
