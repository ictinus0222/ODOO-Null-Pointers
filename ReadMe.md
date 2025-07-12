# Rewear

**Rewear** is a full-featured, community-driven clothing exchange web application. It enables users to share, swap, and redeem clothing items in an eco-conscious, gamified system. Built with a robust Node.js and Express.js backend and a modern frontend interface, Rewear promotes sustainable fashion by making clothes exchangeable, trackable, and rewarding.

---

## 🔧 Tech Stack

### **Frontend**
- **HTML** – Structure of the web interface
- **CSS** – Styling and layout design
- **JavaScript** – Client-side interactivity and logic

### **Backend**
- **Node.js** – Server environment
- **Express.js** – RESTful API framework
- **MongoDB** – NoSQL database
- **Mongoose** – ODM for MongoDB
- **JWT (JSON Web Tokens)** – User authentication
- **Bcrypt.js** – Password hashing
- **Multer** – File upload middleware
- **Cloudinary** – Cloud-based image hosting
- **dotenv** – Environment variable configuration

---

## 🚀 Features

### 🧑‍💼 User Authentication
- Secure registration and login
- Token-based (JWT) session management
- Passwords stored using Bcrypt hashing

### 👕 Item Management (CRUD)
- **Create** a clothing item listing with description, size, condition, etc.
- **Read** all items or user-specific items
- **Update** item details
- **Delete** item listings

### 📷 Image Upload
- Upload clothing images using Multer
- Images stored securely on Cloudinary

### 🔁 Swap System
- Users can send swap requests to others
- Item owners can accept or reject requests
- On **acceptance**:
  - Item status changes to `swapped`
  - Swap is recorded in both users' history
- On **rejection**:
  - Request is marked as rejected

### 💎 Points Redemption System
- Users earn points for listing clothing items
- Users can **redeem** items using points
- System verifies point balance and deducts appropriately
- Item status changes to `redeemed`
- All redemptions are logged in user history

### 📊 User Dashboard
- View uploaded item listings
- View sent and received swap requests
- Track point balance
- Access full history of swaps and redemptions

### 🛠️ Admin Panel (API)
- View all pending item listings
- Approve or reject listings
- Access restricted admin-only endpoints for:
  - Moderation
  - Verification
  - Item flagging/detection

---

## 📁 Project Structure (Backend)

```
rewear/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utils/
├── config/
├── .env
├── server.js
```

---

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/rewear.git
   cd rewear
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   Create a `.env` file in the root:
   ```
   PORT=5000
   MONGODB_URI=your_mongo_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Run the server**
   ```bash
   npm start
   ```

---

## 📌 Future Enhancements

- Real-time notifications for swap requests
- Search and filter system for item listings
- Email verification and password recovery
- Admin analytics dashboard
