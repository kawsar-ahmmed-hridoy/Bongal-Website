# বঙ্গাল🌾

**ঐতিহ্যের সাথে বর্তমান**

A full-stack web platform connecting authentic village products from Bangladesh with customers through a modern digital marketplace.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## ✨ Features

### Core Features
- ✅ **User Management**
  - Registration & Login (Email/Phone)
  - Forgot Password Option
  - Role-based access (Buyer, Admin)
  - Profile management

- ✅ **Product Management**
  - Add, edit, delete products (Admin/Seller)
  - Image upload with multiple views
  - Category & inventory management
  - Advanced search & filtering

- ✅ **Shopping Experience**
  - Add to cart functionality
  - Real-time cart updates
  - Guest & logged-in checkout
  - Order summary before purchase

- ✅ **Payment Integration**
  - SSLCommerz integration (Bangladesh)
  - bKash/Nagad mobile payments
  - Stripe for international payments
  - Failed transaction handling

- ✅ **Order Management**
  - Order history & tracking
  - Status updates (Pending → Shipped → Delivered)
  - Admin order dashboard

- ✅ **Review & Rating System**
  - Product ratings (1-5 stars)
  - Customer feedback
  - Average ratings display

- ✅ **Security**
  - JWT authentication
  - HTTPS encryption
  - Input validation & sanitization
  - Role-based access control

### Advanced Features
- 📊 Admin analytics dashboard
- 🔔 Email/SMS notifications
- 💬 Buyer-Seller messaging
- 🌐 SEO-optimized pages
- 📱 Progressive Web App (PWA)
- 🗺️ Location-based features
- 🤖 AI product recommendations

---

## 🛠 Tech Stack

### Frontend
```
├── React.js 18.x          # UI framework
├── TailwindCSS 3.x        # Styling
├── Lucide React           # Icons
├── React Router           # Navigation
├── Axios                  # HTTP client
└── React Query            # State management
```

### Backend
```
├── Node.js 22.x           # Runtime environment
├── Express.js 5.x         # Web framework
├── TypeScript 5.x         # Type safety
├── MongoDB 8.x            # Database
├── Mongoose               # ODM
├── JWT                    # Authentication
├── Bcrypt                 # Password hashing
└── Multer                 # File uploads
```

### DevOps & Tools
```
├── Docker                 # Containerization
├── Nginx                  # Reverse proxy
├── PM2                    # Process manager
├── Jest                   # Testing
└── ESLint + Prettier      # Code quality
```

---

## 📁 Project Structure

```
bongal/
│
├── bongal-client/                          # Frontend application
│   ├── public/
│   │   
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── AuthComponents.jsx
│   │   │   │   ├── Layout.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   ├── NotFound.jsx
│   │   │   │   ├── ProtectedRoutes.jsx
│   │   │   │   └── AuthHOCs.js
│   │   │   │
│   │   │   ├── home/
│   │   │   │   ├── HomePage.jsx
│   │   │   │   ├── HeroSection.jsx
│   │   │   │   └── FeaturedProducts.jsx
│   │   │   │
│   │   │   ├── products/
│   │   │   │   ├── ProductsPage.jsx
│   │   │   │   ├── ProductDetail.jsx
│   │   │   │   └── ProductFilters.jsx
│   │   │   │
│   │   │   ├── cart/
│   │   │   │   ├── CartPage.jsx
│   │   │   │   ├── CartItem.jsx
│   │   │   │   └── OrderSummary.jsx
│   │   │   │
│   │   │   ├── orders/
│   │   │   │   ├── OrdersPage.jsx
│   │   │   │   └── OrderCard.jsx
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   ├── RegisterPage.jsx
│   │   │   │   ├── ProfilePage.jsx
│   │   │   │   ├── VerifyCodePage.jsx
│   │   │   │   └── ForgotPassword.jsx
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── ProductManagement.jsx
│   │   │       ├── OrderManagement.jsx
│   │   │       └── Analytics.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   ├── orderService.js
│   │   │   └── paymentService.js
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useCart.js
│   │   │   ├── useTheme.js
│   │   │   └── useProducts.js
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   │
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   ├── validation.js
│   │   │   └── helpers.js
│   │   │
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── package.json
│   ├── tailwind.config.js
│   ├── eslint.config.json
│   ├── package-lock.js
│   └── vite.config.js
│
├── bongal-server/                          # Backend application
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   ├── cloudinary.ts
│   │   │   └── payment.ts
│   │   │
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Product.ts
│   │   │   ├── Order.ts
│   │   │   ├── Review.ts
│   │   │   └── Category.ts
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── productController.ts
│   │   │   ├── orderController.ts
│   │   │   ├── userController.ts
│   │   │   └── paymentController.ts
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── productRoutes.ts
│   │   │   ├── orderRoutes.ts
│   │   │   ├── userRoutes.ts
│   │   │   └── paymentRoutes.ts
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── errorHandler.ts
│   │   │   ├── validation.ts
│   │   │   └── upload.ts
│   │   │
│   │   ├── services/
│   │   │   ├── authService.ts
│   │   │   ├── productService.ts
│   │   │   ├── orderService.ts
│   │   │   ├── emailService.ts
│   │   │   └── smsService.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── validation.ts
│   │   │   ├── jwt.ts
│   │   │   └── helpers.ts
│   │   │
│   │   ├── types/
│   │   │   ├── user.types.ts
│   │   │   ├── product.types.ts
│   │   │   └── order.types.ts
│   │   │
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   └── nodemon.json
│
├── docker/  
│   ├── client.dev.Dockerfile
│   ├── server.dev.Dockerfile
│   ├── client.Dockerfile
│   └── server.Dockerfile
│
├── .gitignore
├── docker-compose.dev.yml
├── docker-compose.prod.yml
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- Node.js >= 22.x
- MongoDB >= 8.x
- npm
- Git

### Clone Repository
```bash
git clone https://github.com/kawsar-ahmmed-hridoy/Bongal-Website
cd bongal
```

### Install Dependencies

#### Client
```bash
cd bongal-client
npm install
```

#### Server
```bash
cd bongal-server
npm install
```

---

## 🔐 Environment Variables

### Client (.env)
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

# OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_FACEBOOK_APP_ID=your_facebook_app_id

# App Configuration
VITE_APP_NAME=বঙ্গাল
VITE_APP_URL=http://localhost:3000
```

### Server (.env)
```env
# Server Configuration
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/bongal
MONGODB_TEST_URI=mongodb://localhost:27017/bongal_test

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRE=30d

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Payment Gateways
# SSLCommerz
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_store_password
SSLCOMMERZ_IS_LIVE=false

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Email Service (SendGrid/NodeMailer)
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone

```

---

## 🏃 Running the Application

### Development Mode

#### Start MongoDB
```bash
# Using MongoDB service
sudo systemctl start mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### Start Server
```bash
cd bongal-server
npm run dev
# Server running on http://localhost:5000
```

#### Start Client
```bash
cd bongal-client
npm run dev
# Client running on http://localhost:3000
```

### Production Mode

#### Build Client
```bash
cd bongal-client
npm run build
```

#### Start Server
```bash
cd bongal-server
npm run build
npm start
```

### Using Docker
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Hridoy Redwan",
  "email": "hridoy@redwan.com",
  "password": "password123",
  "phone": "01714440146",
  "address": "Dhaka, Bangladesh"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "hridoy@redwan.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

### Product Endpoints

#### Get All Products
```http
GET /api/products?category=honey&minPrice=100&maxPrice=1000&search=মধু
```

#### Get Single Product
```http
GET /api/products/:id
```

#### Create Product (Admin)
```http
POST /api/products
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Pure Village Honey",
  "name_bn": "খাঁটি গ্রামের মধু",
  "price": 450,
  "category": "honey",
  "stock": 25,
  "description": "Pure organic honey",
  "images": ["url1", "url2"]
}
```

#### Update Product (Admin)
```http
PUT /api/products/:id
Authorization: Bearer {admin_token}
```

#### Delete Product (Admin)
```http
DELETE /api/products/:id
Authorization: Bearer {admin_token}
```

### Order Endpoints

#### Create Order
```http
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "items": [
    { "product": "product_id", "quantity": 2 }
  ],
  "shippingAddress": "Full address",
  "paymentMethod": "bKash"
}
```

#### Get User Orders
```http
GET /api/orders/my-orders
Authorization: Bearer {token}
```

#### Get All Orders (Admin)
```http
GET /api/orders
Authorization: Bearer {admin_token}
```

#### Update Order Status (Admin)
```http
PUT /api/orders/:id/status
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "Shipped"
}
```

### Payment Endpoints

#### Initialize Payment
```http
POST /api/payment/initialize
Authorization: Bearer {token}
Content-Type: application/json

{
  "orderId": "order_id",
  "amount": 1000,
  "method": "bKash"
}
```

#### Verify Payment
```http
POST /api/payment/verify
Content-Type: application/json

{
  "transactionId": "txn_123",
  "orderId": "order_id"
}
```

---

## 📸 Screenshots

### Home Page
![Home Page](https://via.placeholder.com/800x400?text=Home+Page)

### Products Page
![Products](https://via.placeholder.com/800x400?text=Products+Page)

### Admin Dashboard
![Admin](https://via.placeholder.com/800x400?text=Admin+Dashboard)

---

## 🧪 Testing

### Run Tests
```bash
# Client tests
cd bongal-client
npm test

# Server tests
cd bongal-server
npm test

```

---

## 🚢 Deployment

### Vercel (Client)
```bash
cd client
vercel --prod
```

### Render/Railway (Server)
1. Connect GitHub repository
2. Set environment variables
3. Deploy

---

## 🤝 Contributing

For contributions, please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages
- Add tests for new features

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Developer-01**: Kawsar Ahmmed Hridoy
- **Developer-02**: Md. Redwan Hassan

---

## 📞 Contact

- **Email**: kawsarhridoy0146@gmail.com
- **Email**: redwan980@gmail.com
- **Website**: https://bongal.com
- **Facebook**: [facebook.com/bongal](https://www.facebook.com/bongal4)

---