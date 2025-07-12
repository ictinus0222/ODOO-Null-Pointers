# ReWear - Community Clothing Exchange Frontend

A minimal frontend for the ReWear platform built with vanilla HTML, CSS, and JavaScript.

## Features

### User Features
- **Landing Page**: Platform introduction with featured items carousel
- **User Authentication**: Email/password registration and login
- **Browse Items**: View all available clothing items with filtering by category and size
- **Item Details**: View detailed information about each item
- **User Dashboard**: Profile management, view listed items, and swap history
- **Add New Items**: Upload images and create new listings

### Admin Features
- **Admin Panel**: Moderate and approve/reject item listings
- **User Management**: View all registered users
- **Item Moderation**: Approve or reject pending items

## Setup Instructions

### Prerequisites
- The backend server should be running on `http://localhost:5000`
- Make sure CORS is properly configured on the backend

### Running the Frontend

1. **Simple Setup**: Just open `index.html` in a web browser
   - Double-click the `index.html` file
   - Or drag and drop it into your browser

2. **Using a Local Server** (Recommended):
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Access the Application**:
   - Open your browser and go to `http://localhost:8000` (if using a server)
   - Or simply open the `index.html` file directly

## API Endpoints Used

The frontend connects to these backend endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get specific item
- `POST /api/items` - Create new item (with image upload)
- `GET /api/user/profile` - Get user profile
- `GET /api/user/my-items` - Get user's items
- `GET /api/user/swaps` - Get swap history
- `GET /api/admin/pending-items` - Get pending items (admin)
- `PUT /api/admin/approve-item/:id` - Approve item (admin)
- `PUT /api/admin/reject-item/:id` - Reject item (admin)
- `GET /api/admin/users` - Get all users (admin)

## File Structure

```
frontend/
├── index.html          # Main HTML file with all pages
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Features Overview

### Landing Page
- Hero section with call-to-action buttons
- Featured items carousel
- Navigation to other sections

### Authentication
- Tabbed login/register forms
- Token-based authentication
- Automatic session management

### Browse Items
- Grid layout of all available items
- Filter by category and size
- Click to view item details

### Item Details
- Image gallery
- Complete item information
- Action buttons for swap/redemption

### User Dashboard
- Profile information
- List of user's uploaded items
- Swap history

### Add Item Form
- Multi-step form with image upload
- Preview functionality
- Category and condition selection

### Admin Panel
- Pending items approval/rejection
- User management
- Tabbed interface

## Browser Compatibility

This frontend works with all modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your backend has CORS enabled
2. **API Connection**: Ensure the backend is running on port 5000
3. **Image Upload**: Check that the backend supports multipart/form-data
4. **Authentication**: Verify JWT tokens are being handled correctly

### Development Tips

- Open browser developer tools (F12) to see console logs
- Check the Network tab to monitor API calls
- Use the Application tab to inspect localStorage for tokens

## Future Enhancements

- Real-time notifications using WebSocket
- Advanced search and filtering
- Image optimization and compression
- Progressive Web App (PWA) features
- Offline functionality
- Social sharing features

## Contributing

This is a minimal implementation. For production use, consider:
- Adding proper error handling
- Implementing loading states
- Adding form validation
- Optimizing for performance
- Adding accessibility features
