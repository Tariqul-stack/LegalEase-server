# LegalEase — Backend API Server

> RESTful API server for LegalEase — an online lawyer hiring platform. Built with Express.js, MongoDB, and JWT authentication. Supports role-based access control, Stripe payment processing, and Google OAuth.

---

## 🌐 Live Links

| Service | URL |
|--------|-----|
| ⚙️ Server (Backend) | [https://legalease-server.onrender.com](https://legalease-server.onrender.com) *(update after deployment)* |
| 🖥️ Client (Frontend) | [https://legalease-client.vercel.app](https://legalease-client.vercel.app) *(update after deployment)* |
| 📁 Client Repository | [https://github.com/Tariqul-stack/LegalEase_client](https://github.com/Tariqul-stack/LegalEase_client) |
| 📁 Server Repository | [https://github.com/Tariqul-stack/LegalEase-server](https://github.com/Tariqul-stack/LegalEase-server) |

---

## 📌 Project Overview

LegalEase is a digital platform that connects legal seekers with verified lawyers. This repository contains the backend REST API that powers the entire platform — handling authentication, lawyer management, hiring requests, payments, comments, and admin analytics.

---

## 🛠️ Tech Stack

| Package | Version | Purpose |
|--------|---------|---------|
| `express` | 5 | Backend web framework |
| `mongoose` | 9 | MongoDB ODM |
| `jsonwebtoken` | 9 | JWT token generation & verification |
| `bcryptjs` | 3 | Password hashing |
| `stripe` | latest | Payment processing |
| `cors` | latest | Cross-origin request handling |
| `dotenv` | latest | Environment variable management |
| `nodemon` | latest | Development auto-restart |

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Stripe account (test mode)

### 1. Clone the Repository

```bash
git clone https://github.com/Tariqul-stack/LegalEase-server.git
cd LegalEase-server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment Variables

Create a `.env` file in the root directory:

```env
PORT=8000
MONGO_DB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/legalEase_db?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

### 4. Seed the Database

```bash
node src/seed.js
```

This creates:
- 1 Admin account
- 30 Lawyer accounts with realistic profiles

### 5. Start the Server

```bash
npm run dev
```

Server runs on: `http://localhost:8000`

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@legalease.com | admin123 |
| Lawyer | james.wilson@legalease.com | admin123 |

---

## 📁 Project Structure

```
legalease-server/
└── src/
    ├── models/
    │   ├── user.model.js        # User schema (user/lawyer/admin roles)
    │   ├── lawyer.model.js      # Lawyer profile schema
    │   ├── hiring.model.js      # Hiring request schema
    │   ├── comment.model.js     # Review/comment schema
    │   └── transaction.model.js # Payment transaction schema
    ├── routes/
    │   ├── auth.routes.js       # Register, login, Google OAuth
    │   ├── lawyer.routes.js     # Lawyer CRUD
    │   ├── hiring.routes.js     # Hiring requests & payments
    │   ├── comment.routes.js    # Reviews & comments
    │   ├── admin.routes.js      # Admin management & analytics
    │   └── user.routes.js       # User profile
    ├── middleware/
    │   ├── verifyToken.js       # JWT authentication middleware
    │   └── checkRole.js         # Role-based access control
    ├── seed.js                  # Database seeding script
    └── index.js                 # Server entry point
```

---

## 🔗 API Endpoints

### Base URL
```
http://localhost:8000
```

### Auth Routes — `/api/auth`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login with email/password |
| POST | `/api/auth/google-login` | Public | Login/register with Google OAuth |

### User Routes — `/api/users`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/users/profile` | User (JWT) | Get logged-in user profile |
| PUT | `/api/users/profile` | User (JWT) | Update name and photo |

### Lawyer Routes — `/api/lawyers`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/lawyers` | Public | Get all published lawyers |
| GET | `/api/lawyers/:id` | Public | Get single lawyer by ID |
| POST | `/api/lawyers` | Lawyer (JWT) | Create lawyer profile |
| PUT | `/api/lawyers/:id` | Lawyer (JWT) | Update lawyer profile |
| DELETE | `/api/lawyers/:id` | Admin (JWT) | Delete lawyer |

### Hiring Routes — `/api/hirings`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/hirings` | User (JWT) | Create hiring request |
| GET | `/api/hirings/user` | User (JWT) | Get user's hiring history |
| GET | `/api/hirings/lawyer` | Lawyer (JWT) | Get lawyer's hiring requests |
| PATCH | `/api/hirings/:id/status` | Lawyer (JWT) | Accept or reject hiring |
| POST | `/api/hirings/:id/pay` | User (JWT) | Create Stripe payment intent |
| POST | `/api/hirings/:id/confirm-payment` | User (JWT) | Confirm payment & save transaction |

### Comment Routes — `/api/comments`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/comments` | User (JWT, hired only) | Post a review |
| GET | `/api/comments/:lawyerId` | Public | Get comments for a lawyer |
| GET | `/api/comments/user/my-comments` | User (JWT) | Get user's own comments |
| PUT | `/api/comments/:id` | User (JWT) | Edit a comment |
| DELETE | `/api/comments/:id` | User (JWT) | Delete a comment |

### Admin Routes — `/api/admin`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/admin/users` | Admin (JWT) | Get all users |
| PATCH | `/api/admin/users/:id/role` | Admin (JWT) | Change user role |
| DELETE | `/api/admin/users/:id` | Admin (JWT) | Delete a user |
| GET | `/api/admin/transactions` | Admin (JWT) | Get all transactions |
| GET | `/api/admin/analytics` | Admin (JWT) | Get platform analytics |

---

## 🔐 Authentication

All protected routes require a JWT token in the request header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are issued on login/register and expire after **7 days**.

### Roles
| Role | Access Level |
|------|-------------|
| `user` | Browse, hire, comment, manage own profile |
| `lawyer` | Manage legal profile, accept/reject hirings |
| `admin` | Full access to all routes and data |

---

## 💳 Stripe Payment Flow

1. User clicks "Pay Now" on an accepted hiring
2. Client calls `POST /api/hirings/:id/pay` → server creates Stripe PaymentIntent → returns `clientSecret`
3. Client uses Stripe.js to collect card details and confirm payment
4. On success, client calls `POST /api/hirings/:id/confirm-payment`
5. Server sets `isPaid: true` on the hiring and creates a Transaction record

**Test Card:**
```
Card Number: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

---

## 🌍 Deployment

Deployed on **Render** with the following environment variables set in the dashboard:

```
PORT=8000
MONGO_DB_URL=your_production_mongodb_url
JWT_SECRET=your_production_jwt_secret
STRIPE_SECRET_KEY=your_production_stripe_secret_key
```

---

## 📊 Database Models

### User
```js
{
  name: String,
  email: String (unique),
  password: String (hashed),
  photo: String,
  role: enum['user', 'lawyer', 'admin'],
  timestamps: true
}
```

### Lawyer
```js
{
  userId: ObjectId (ref: User),
  name: String,
  email: String,
  photo: String,
  bio: String,
  specialization: String,
  consultationFee: Number,
  status: enum['available', 'busy'],
  isPublished: Boolean,
  totalHires: Number,
  timestamps: true
}
```

### Hiring
```js
{
  userId: ObjectId (ref: User),
  lawyerId: ObjectId (ref: Lawyer),
  clientName: String,
  clientEmail: String,
  lawyerName: String,
  specialization: String,
  fee: Number,
  status: enum['pending', 'accepted', 'rejected'],
  isPaid: Boolean,
  timestamps: true
}
```

### Transaction
```js
{
  userId: ObjectId,
  lawyerId: ObjectId,
  hiringId: ObjectId,
  userEmail: String,
  lawyerEmail: String,
  amount: Number,
  transactionId: String,
  timestamps: true
}
```

### Comment
```js
{
  userId: ObjectId (ref: User),
  lawyerId: ObjectId (ref: Lawyer),
  clientName: String,
  clientPhoto: String,
  comment: String,
  timestamps: true
}
```