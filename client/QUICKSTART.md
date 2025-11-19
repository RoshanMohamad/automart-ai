# 🚀 Quick Start Guide - Admin Image Upload

## Getting Started

### 1. Start the Development Server

```bash
cd d:\personal\automart-ai\client
npm run dev
```

### 2. Login to Admin Panel

Open your browser to the local dev server URL (usually `http://localhost:5173`)

**Demo Credentials:**
- Email: `admin@automart.com`
- Password: `admin123`

### 3. Upload Images

Once logged in, you'll see the Admin Dashboard with:

1. **Dashboard Statistics** - Shows image counts and storage (currently demo values)
2. **Image Upload Area** - Beautiful drag & drop interface

#### To Upload:
- **Option 1:** Drag image files directly onto the upload area
- **Option 2:** Click anywhere in the upload area to open file browser

#### Upload Features:
- ✅ Validates file type (images only)
- ✅ Validates file size (max 5MB)
- ✅ Shows loading spinner during upload
- ✅ Displays success/error messages

### 4. Manage Images

After uploading, you'll see your images in the gallery:

- **Copy URL** - Click to copy the image URL to clipboard
- **Delete** - Click trash icon to remove the image

### 5. Logout

Click the logout button in the top right to sign out.

## File Structure Created

```
client/src/
├── components/
│   └── admin/
│       └── ImageUpload.tsx          # Main upload component
├── context/
│   └── AuthContext.tsx              # Authentication logic
├── pages/
│   ├── Login.tsx                    # Login page
│   └── AdminDashboard.tsx           # Admin dashboard
├── App.tsx                          # Main app with routing
└── main.tsx                         # Entry point
```

## Next Steps for Production

### 1. Backend API Integration

Update `ImageUpload.tsx` to connect to your server:

```tsx
// In uploadFiles function, replace the simulation with:
const formData = new FormData();
fileArray.forEach(file => formData.append('images', file));

const response = await fetch('http://localhost:YOUR_PORT/api/admin/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: formData
});

const data = await response.json();
// data should contain: { images: [{ id, url, name, size }] }
```

### 2. Update Authentication

In `AuthContext.tsx`, update the login function:

```tsx
const login = async (email: string, password: string) => {
  const response = await fetch('http://localhost:YOUR_PORT/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error('Login failed');

  const data = await response.json();
  setUser(data.user);
  localStorage.setItem('user', JSON.stringify(data.user));
  localStorage.setItem('token', data.token);
};
```

### 3. Server-Side Upload Endpoint Example

```javascript
// server/routes/adminRoutes.js
const express = require('express');
const multer = require('multer');
const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed'));
    }
  }
});

router.post('/upload', authMiddleware, upload.array('images'), (req, res) => {
  const images = req.files.map(file => ({
    id: file.filename,
    url: `/uploads/${file.filename}`,
    name: file.originalname,
    size: file.size
  }));
  
  res.json({ images });
});

module.exports = router;
```

## Features Included

✅ Secure admin authentication
✅ Protected routes
✅ Drag & drop image upload
✅ File browser upload
✅ Image validation (type & size)
✅ Beautiful loading states
✅ Responsive image gallery
✅ Copy URL to clipboard
✅ Delete images
✅ Success/error notifications
✅ Professional UI with gradients
✅ Hover effects and animations
✅ Mobile responsive design

## Troubleshooting

### "Cannot find module" errors
- Run `npm install` to ensure all dependencies are installed
- Restart the dev server

### Images not uploading
- Check browser console for errors
- Ensure file is under 5MB
- Ensure file is an image type

### Login not working
- Use the exact demo credentials: `admin@automart.com` / `admin123`
- Check browser console for errors

---

## 📚 Full Documentation

See `ADMIN_UPLOAD_README.md` for complete documentation.

🎉 **Enjoy your new admin image upload system!**
