# Quick Setup Guide

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone <your-github-repo-url>
cd Team-2335
npm install
```

### 2. Create Environment File
Create a `.env` file in the root directory with:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/rewear
JWT_SECRET=your-super-secret-jwt-key-here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Set Up Services

#### MongoDB (Choose one):
- **Local**: Install MongoDB and start the service
- **Atlas**: Create free account at mongodb.com/atlas and get connection string

#### Cloudinary:
- Create free account at cloudinary.com
- Get credentials from dashboard

### 4. Run the App
```bash
npm run dev
```

Server runs on: `http://localhost:5000`

## 📝 Environment Variables Explained

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 5000) | No |
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret for JWT tokens | Yes |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret | Yes |

## 🔧 Common Setup Issues

### MongoDB Connection Failed
- Check if MongoDB is running
- Verify connection string format
- For Atlas: Ensure IP whitelist includes your IP

### Cloudinary Upload Fails
- Verify all three Cloudinary credentials
- Check if account is active
- Ensure cloud name is correct

### Port Already in Use
```bash
npx kill-port 5000
# or change PORT in .env file
```

## 🎯 Next Steps

1. Open `index.html` in your browser
2. Register a new user account
3. Upload some clothing items
4. Test the swap functionality

## 📞 Need Help?

- Check the main README.md for detailed documentation
- Review the troubleshooting section
- Check console logs for error messages 