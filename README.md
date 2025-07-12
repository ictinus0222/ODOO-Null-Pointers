
##  Team Name: 2335
Team Leader: abhinavtyagi9451@gmail.com
# ReWear Clothing Exchange Community

A full-stack web application for clothing exchange and community building. Users can upload items, request swaps, earn points, and interact with other community members.

## 🚀 Features

- **User Authentication**: Secure login/register with JWT tokens
- **Item Management**: Upload, view, and manage clothing items
- **Swap System**: Request and accept clothing swaps
- **Points System**: Earn points for successful swaps
- **Admin Panel**: Manage users and items
- **Real-time Updates**: Socket.io for live notifications
- **Image Upload**: Cloudinary integration for item images
- **Dark Mode**: Modern minimalist aesthetic

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, MongoDB
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer + Cloudinary
- **Real-time**: Socket.io
- **Frontend**: HTML, CSS, JavaScript (Vanilla)

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-github-repo-url>
cd Team-2335
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/rewear
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/rewear

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Create a database named `rewear`

#### Option B: MongoDB Atlas (Recommended)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace `MONGO_URI` in your `.env` file

### 5. Cloudinary Setup

1. Create a free account at [Cloudinary](https://cloudinary.com/)
2. Get your cloud name, API key, and API secret
3. Add them to your `.env` file

## 🏃‍♂️ Running the Application

### Development Mode (with auto-restart)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
Team-2335/
├── app.js                 # Express app configuration
├── server.js              # Server entry point
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables (create this)
├── controllers/           # Route controllers
│   ├── adminController.js
│   ├── authController.js
│   ├── itemController.js
│   ├── uploadController.js
│   └── userController.js
├── middlewares/          # Custom middleware
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   └── uploadImage.js
├── models/               # Database models
│   ├── Admin.js
│   ├── Item.js
│   └── User.js
├── routes/               # API routes
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── itemRoutes.js
│   ├── uploadRoutes.js
│   └── userRoutes.js
└── utils/                # Utility functions
    ├── cloudinary.js
    └── tokenUtils.js
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login

### Items
- `GET /api/items` - Get all items
- `POST /api/items` - Create new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item
- `POST /api/items/:id/swap-request` - Request swap
- `POST /api/items/:id/swap-decision` - Accept/reject swap

### Users
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/swap-requests` - Get user's swap requests

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/items` - Get all items
- `DELETE /api/admin/users/:id` - Delete user
- `DELETE /api/admin/items/:id` - Delete item

### Upload
- `POST /api/upload/image` - Upload image to Cloudinary

## 🎨 Frontend

The frontend is built with vanilla HTML, CSS, and JavaScript. Open `index.html` in your browser or serve it using a local server.

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation
- Error handling middleware

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check your connection string in `.env`
   - Verify network connectivity

2. **Cloudinary Upload Errors**
   - Verify your Cloudinary credentials in `.env`
   - Check if your Cloudinary account is active

3. **Port Already in Use**
   - Change the PORT in `.env` file
   - Kill processes using the port: `npx kill-port 5000`

4. **Module Not Found Errors**
   - Run `npm install` again
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Debug Mode

To run with additional logging:

```bash
DEBUG=* npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

**Team Name**: 2335  
**Team Leader**: abhinavtyagi9451@gmail.com

---

**Happy Coding! 🎉**
