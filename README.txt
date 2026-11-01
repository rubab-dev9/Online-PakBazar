# 🛒 Online PakBazar – E-Commerce Platform

**A Full-Stack Multi-Vendor E-Commerce Marketplace**

Online PakBazar is a web-based digital marketplace developed as a **Final Year Project (FYP)** for the BS Software Engineering program at Virtual University of Pakistan. It connects suppliers and customers through a centralized platform managed by an administrator.

The platform allows suppliers to manage their products and orders, customers to browse products and make purchases, and administrators to oversee the entire marketplace. It features role-based dashboards, secure authentication, order tracking, product reviews, and email notifications.

---

## 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Technologies Used](#-technologies-used)
- [Key Features](#-key-features)
- [User Roles](#-user-roles)
- [System Architecture](#-system-architecture)
- [Database Collections](#-database-collections)
- [API Endpoints](#-api-endpoints)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Developer](#-developer)
- [Supervisor](#-supervisor)

---

## 📖 Project Overview

Online PakBazar provides a complete e-commerce solution with three distinct user roles:

- **Admin:** Manages users, suppliers, products, orders, and customer inquiries.
- **Supplier:** Adds and manages products, processes orders, and responds to customer reviews.
- **Customer:** Browses products, manages a shopping cart and wishlist, places orders, and submits reviews.

The main objective of this project is to promote local businesses, simplify the buying and selling process, and provide a secure and user-friendly online shopping experience.

---

## 💻 Technologies Used

### Frontend

| Technology | Purpose |
|---|---|
| React.js | User Interface Development |
| React Router DOM | Client-Side Routing |
| React Bootstrap (v5) | UI Components |
| React Icons | Icon Library |
| Axios | HTTP Requests |
| React Toastify | Toast Notifications |
| CSS3 | Custom Styling |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript Runtime Environment |
| Express.js | Backend Web Framework |
| JWT | Authentication and Authorization |
| bcryptjs | Password Hashing |
| Nodemailer | Email Services |

### Database

| Technology | Purpose |
|---|---|
| MongoDB | NoSQL Database |
| Mongoose | Object Data Modeling |
| MongoDB Compass | Database Management GUI |

### Development Tools

| Tool | Purpose |
|---|---|
| Visual Studio Code | Code Editor |
| Postman | API Testing |
| Git & GitHub | Version Control |
| Google Docs | Documentation |
| Google Slides | Presentation |

---

## ✨ Key Features

### 1. Authentication & Profile Management

- User registration with email OTP verification.
- Secure login using JWT authentication.
- Role-based access control (Admin, Supplier, Customer).
- Profile management and profile updates.
- Change password functionality.
- Forgot and reset password functionality.

### 2. Product Management

- Suppliers can add, edit, and delete products.
- Product information includes name, description, price, category, stock, and images.
- Product image uploads using Base64 encoding with compression.
- Automatic stock status management:
  - In Stock
  - Low Stock
  - Out of Stock

**Product Categories:**
- Grocery
- Electronics
- Home Essentials
- Fashion

### 3. Product Search, Filtering & Sorting

- Search products by name, category, and description.
- Filter products by category.
- Filter products by price range.
- Sort products by:
  - Newest Arrivals
  - Price: Low to High
  - Price: High to Low

### 4. Shopping Cart

- Add products to the shopping cart.
- Remove products from the cart.
- Update product quantities.
- Automatic cart total calculation.
- Cart count badge in the navigation bar.

### 5. Wishlist

- Add and remove products from the wishlist.
- Persistent wishlist storage.
- LocalStorage support for guest users.
- Database storage for authenticated users.
- Wishlist count badge in the navigation bar.

### 6. Order Management

- Place orders using Cash on Delivery (COD).
- Automatic unique order ID generation.
- Order tracking with automatic refresh every 30 seconds.
- View personal order history.
- Cancel pending orders.

**Order Status Workflow:**

`Pending → Processing → Shipped → Delivered`

Orders can also be marked as `Cancelled`.

### 7. Payment Management

- Cash on Delivery (COD) payment method.
- Payment status tracking.

### 8. Ratings & Reviews

- Customers can rate products from 1 to 5 stars.
- Write reviews with a title and comment.
- Suppliers can reply to customer reviews.
- Mark reviews as helpful.
- Display average product ratings on product cards.

### 9. Admin Dashboard

- Dashboard statistics:
  - Total Users
  - Total Suppliers
  - Total Products
  - Total Orders
  - Total Revenue
- View and delete users.
- Approve pending supplier accounts.
- Manage all products.
- Manage all customer orders.
- Update order statuses.
- View contact messages and reply to inquiries.

### 10. Supplier Dashboard

- Dashboard statistics:
  - Total Products
  - Total Orders
  - Total Revenue
  - Average Rating
- Add, edit, and delete products.
- View orders containing supplier products.
- Update order statuses.
- View customer reviews and reply to them.
- View top-selling products.

### 11. Additional Pages

- Home Page
- About Us Page
- Contact Us Page
- FAQs Page
- Profile Page

### 12. Notifications & Email Services

- Toast notifications for user actions.
- Email OTP verification.
- Email notifications for contact form replies.
- Contact form email submission using Nodemailer.

### 13. Security Features

- JWT-based authentication.
- Password hashing using bcryptjs (10 salt rounds).
- Role-Based Access Control (RBAC).
- Protected frontend routes.
- Protected backend API endpoints.
- CORS configuration.

### 14. Responsive Design & User Experience

- Fully responsive layout for mobile, tablet, and desktop.
- Modern gradient buttons and cards.
- Loading skeletons for improved user experience.
- Sticky navigation bar.
- Interactive UI components.

---

## 👥 User Roles

| Feature | Admin | Supplier | Customer |
|---|:---:|:---:|:---:|
| Dashboard | ✅ | ✅ | — |
| Manage Users | ✅ | — | — |
| Approve Suppliers | ✅ | — | — |
| Manage Products | ✅ | Own Products | — |
| Browse Products | ✅ | ✅ | ✅ |
| Shopping Cart | — | — | ✅ |
| Wishlist | — | — | ✅ |
| Place Orders | — | — | ✅ |
| Manage Orders | All Orders | Own Product Orders | Own Orders |
| Product Reviews | — | View & Reply | Add Reviews |
| Contact Messages | View & Reply | — | Send Messages |
| Profile Management | ✅ | ✅ | ✅ |

---

## 🏗️ System Architecture

Online PakBazar follows a MERN Stack architecture:

- **Frontend:** React.js handles the user interface and client-side interactions.
- **Backend:** Node.js and Express.js handle API requests, authentication, and business logic.
- **Database:** MongoDB stores users, products, orders, reviews, and other application data.
- **Authentication:** JWT manages secure user sessions and role-based authorization.
- **Email Service:** Nodemailer handles OTP verification and email notifications.

**Application Flow:**

`React Frontend → Axios API Requests → Express.js Server → Mongoose → MongoDB`

---

## 🗄️ Database Collections

The application uses the following MongoDB collections:

| Collection | Description |
|---|---|
| `users` | User information, roles, credentials, and approval status |
| `products` | Product details, prices, categories, stock, images, and supplier references |
| `orders` | Order IDs, items, total amount, status, and shipping address |
| `reviews` | Ratings, titles, comments, users, products, and supplier replies |
| `wishlist` | User wishlist items |
| `contact` | Contact form messages and reply status |
| `otp` | OTP codes used for email verification |

---

## 🔗 API Endpoints

The project includes **53 APIs** covering authentication, products, customers, suppliers, and administration.

### Public Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/verify-otp` | Verify email OTP |
| POST | `/auth/login` | Authenticate user |
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
| PUT | `/supplier/reviews/:reviewId/reply` | Reply to a customer review |

### Admin Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/stats` | Get admin dashboard statistics |
| GET | `/admin/users` | Get all users |
| PUT | `/admin/approve-supplier/:id` | Approve supplier account |
| GET | `/admin/messages` | Get contact messages |
| POST | `/admin/reply` | Reply to a contact message |

> **Note:** The tables above show selected API endpoints. The complete application contains 53 APIs.

---

## 🚀 Getting Started

Follow these instructions to set up and run Online PakBazar locally.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (Local installation or MongoDB Atlas)
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/) (Recommended)

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate to the project directory:

```bash
cd Online-PakBazar
```

### 2. Backend Setup

Navigate to the server directory:

```bash
cd server
```

Install backend dependencies:

```bash
npm install
```

Create a `.env` file inside the `server` directory and configure the environment variables.

### 3. Frontend Setup

Open a new terminal and navigate to the client directory:

```bash
cd client
```

Install frontend dependencies:

```bash
npm install
```

Create a `.env` file inside the `client` directory.

### 4. Run the Application

**Start the Backend Server:**

From the `server` directory:

```bash
npm run dev
```

Backend server:

```text
http://localhost:5000
```

**Start the Frontend Application:**

From the `client` directory:

```bash
npm run dev
```

Frontend application:

```text
http://localhost:5173
```

---

## ⚙️ Environment Variables

### Backend Configuration

Create `server/.env`:

```env
PORT=5000

# Database
MONGO_URI=your_mongodb_connection_string

# JWT Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_app_password

FROM_EMAIL=your_email@gmail.com
ADMIN_EMAIL=admin@pakbazar.com

# Frontend URL
FRONTEND_URI=http://localhost:5173
```

### Frontend Configuration

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

> **Important:** Replace all placeholder values with your actual credentials and configuration. Never upload `.env` files, database credentials, email passwords, or JWT secrets to GitHub.

---

## 📁 Project Structure

The project is organized into separate frontend and backend directories.

```text
Online-PakBazar/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md
```

*Note: This is a representative project structure. Actual folders and filenames may differ depending on the implementation.*

---

## 👩‍💻 Developer

**Umm e Rubab Fatima**

- **VU ID:** BC220401286
- **Program:** BS Software Engineering
- **Project:** Final Year Project (FYP)
- **Project Title:** Online PakBazar – E-Commerce Platform

---

## 🎓 Project Supervisor

**Muhammad Qamar Usman**

- Software Projects & Research Section
- Department of Computer Sciences
- Virtual University of Pakistan

---

## 📄 License

This project was developed for academic purposes as part of the Final Year Project (FYP) requirements at Virtual University of Pakistan.

© 2026 Online PakBazar – All Rights Reserved.

---

**Developed with ❤️ by Umm e Rubab Fatima**
