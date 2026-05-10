# Swapnex 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7+-green.svg)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4+-black.svg)](https://socket.io/)

A premium, full-stack social media platform built with the MERN stack, featuring realtime messaging, modern UI/UX, and scalable architecture. Designed for seamless user interactions, robust security, and high-performance realtime communication.

![Swapnex Preview](./preview.gif)

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication with secure cookie handling
- Password hashing with bcrypt
- CSRF protection in production
- Input validation and sanitization

### 👥 Social Features
- User profiles with customizable bios and avatars
- Follow/unfollow system with realtime updates
- Post creation with image uploads (Cloudinary integration)
- Like, comment, and reply functionality
- Feed algorithm for personalized content

### 💬 Realtime Communication
- Instant messaging with Socket.io
- Real-time notifications for interactions
- Online/offline status indicators
- Message history and conversation management

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Dark mode support
- Smooth animations with Framer Motion
- Mobile-first approach
- Accessible components with Chakra UI

### 🏗️ Architecture
- Modular backend with Express.js
- RESTful API design
- State management with Recoil
- Data fetching with React Query
- File uploads with Cloudinary
- Cron jobs for automated tasks

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, bcrypt
- **Realtime**: Socket.io
- **Security**: Helmet, CORS, Morgan
- **File Storage**: Cloudinary
- **Scheduling**: Node-cron

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **UI Components**: Chakra UI, Lucide React
- **State Management**: Recoil
- **Data Fetching**: TanStack Query
- **Routing**: React Router DOM
- **Animations**: Framer Motion

### DevOps & Tools
- **Version Control**: Git
- **Package Management**: npm
- **Linting**: ESLint
- **Build Tool**: Vite
- **Environment**: dotenv

## 📸 Screenshots

### Homepage Feed
![Homepage](./screenshots/homepage.png)

### User Profile
![Profile](./screenshots/profile.png)

### Chat Interface
![Chat](./screenshots/chat.png)

### Mobile Responsive
![Mobile](./screenshots/mobile.png)

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account or local MongoDB instance
- Cloudinary account for image uploads
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/swapnex.git
   cd swapnex/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

### Database Seeding (Development)

For development purposes, seed the database with demo users:

```bash
curl http://localhost:5000/api/seed
```

Demo login credentials:
- Username: `johndoe`
- Password: `123456`

## 📖 Usage

1. **Register/Login**: Create an account or login with demo credentials
2. **Explore Feed**: Browse posts from users you follow
3. **Create Posts**: Share text and images with your network
4. **Connect**: Follow other users and build your network
5. **Chat**: Send realtime messages to other users
6. **Customize**: Update your profile and preferences

## 🔌 API Documentation

### Authentication Endpoints
- `POST /api/users/signup` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout

### User Management
- `GET /api/users/profile/:username` - Get user profile
- `PUT /api/users/update/:id` - Update user profile
- `POST /api/users/follow/:id` - Follow/unfollow user

### Posts
- `GET /api/posts/feed` - Get user feed
- `POST /api/posts/create` - Create new post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/like/:id` - Like/unlike post

### Messages
- `GET /api/messages/conversations` - Get user conversations
- `GET /api/messages/:userId` - Get messages with user
- `POST /api/messages` - Send message

### Development
- `GET /api/seed` - Seed database with demo data (dev only)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


Built with ❤️ using the MERN stack. Connect, share, and engage in realtime!
