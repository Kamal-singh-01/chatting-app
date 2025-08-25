# Chat App Deployment Guide

## Online Status Issue Fix

The online status functionality has been fixed with the following changes:

### Backend Changes
1. **Fixed socket.js**: Removed duplicate Express app creation and properly integrated with existing server
2. **Updated index.js**: Added proper HTTP server creation and socket.io initialization

### Frontend Changes
1. **Fixed useAuthStore.js**: Corrected socket connection logic for production
2. **Updated Sidebar.jsx**: Added debugging and improved online status display
3. **Added proper socket event handling**

### Deployment Steps

#### 1. Backend Deployment
Deploy your backend to a hosting service (Railway, Render, Heroku, etc.) and get the backend URL.

#### 2. Update Netlify Configuration
Replace `https://your-backend-url.com` in these files with your actual backend URL:

**netlify.toml:**
```toml
[[redirects]]
  from = "/api/*"
  to = "https://YOUR_ACTUAL_BACKEND_URL.com/api/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/socket.io/*"
  to = "https://YOUR_ACTUAL_BACKEND_URL.com/socket.io/:splat"
  status = 200
  force = true
```

**public/_redirects:**
```
/api/* https://YOUR_ACTUAL_BACKEND_URL.com/api/:splat 200
/socket.io/* https://YOUR_ACTUAL_BACKEND_URL.com/socket.io/:splat 200
/* /index.html 200
```

#### 3. Environment Variables
Set these environment variables in your backend hosting service:
- `CLIENT_URL`: Your Netlify frontend URL
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Your JWT secret
- `CLOUDINARY_*`: Your Cloudinary credentials

#### 4. Redeploy
After making these changes, redeploy both your backend and frontend.

### Testing Online Status
1. Open your chat app in two different browser windows/tabs
2. Log in with different user accounts
3. Check the browser console for socket connection logs
4. Verify that online status indicators appear (green dots)
5. Test the "Show online only" filter

### Troubleshooting
- Check browser console for socket connection errors
- Verify backend URL is correct in Netlify redirects
- Ensure CORS is properly configured on backend
- Check that socket.io is accessible from your backend URL

### Socket Connection Flow
1. User logs in → `connectSocket()` is called
2. Socket connects to backend with user ID
3. Backend stores user ID in `userSocketMap`
4. Backend emits `getOnlineUsers` to all clients
5. Frontend receives online users and updates UI
6. Green dots appear for online users
