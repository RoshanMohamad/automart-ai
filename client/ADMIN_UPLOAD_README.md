# AutoMart Admin - Image Upload System

## 🚀 Overview
A complete admin dashboard with secure authentication and professional image upload functionality for the AutoMart platform.

## ✨ Features

### 🔐 Authentication System
- Secure login page with email/password authentication
- Protected admin routes
- Session persistence using localStorage
- Automatic redirect based on authentication status
- Demo credentials for testing

### 🖼️ Image Upload Component
#### Upload Methods:
- **📤 Drag & Drop** - Drop images directly into the upload area
- **📁 File Browser** - Click to select files from your device
- **✅ Validation** - Only images allowed (JPEG, PNG, GIF, WebP, SVG)
- **📏 Size Limit** - Maximum 5MB per image

#### Upload Area UI:
- Beautiful gradient card with purple/slate theme
- Dashed border with hover effects
- Drag-active state with cyan border and scale animation
- Loading spinner with smooth animation during upload
- Clear instructions and file type information

#### Image Gallery:
- Responsive grid layout:
  - 1 column on mobile
  - 2 columns on tablet
  - 3 columns on desktop
- Image preview cards with hover effects
- Smooth scale and glow animations
- File name and formatted size display
- **Copy URL Button** - Copies image URL to clipboard with success notification
- **Delete Button** - Removes image and cleans up memory

### 📊 Admin Dashboard
- Dashboard statistics cards (Total Images, Storage Used, Today's Uploads)
- Professional header with user info and logout
- Sticky navigation
- Clean, modern design with gradient backgrounds

## 🏗️ Project Structure

```
client/src/
├── components/
│   └── admin/
│       └── ImageUpload.tsx       # Reusable image upload component
├── context/
│   └── AuthContext.tsx           # Authentication context provider
├── pages/
│   ├── Login.tsx                 # Admin login page
│   └── AdminDashboard.tsx        # Main admin dashboard
├── App.tsx                       # Main app with routing logic
├── main.tsx                      # App entry point
└── index.css                     # Global styles
```

## 🔧 Installation & Setup

1. **Install dependencies:**
   ```bash
   cd client
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Access the admin panel:**
   - Open your browser to `http://localhost:5173`
   - You'll be redirected to the login page

## 🔑 Demo Credentials

```
Email: admin@automart.com
Password: admin123
```

## 💻 Usage

### For Developers

#### Using the ImageUpload Component

```tsx
import ImageUpload, { UploadedImage } from './components/admin/ImageUpload';

function YourComponent() {
  const handleUploadComplete = (images: UploadedImage[]) => {
    console.log('New images uploaded:', images);
    // Handle uploaded images (e.g., save to database)
  };

  return (
    <ImageUpload 
      onUploadComplete={handleUploadComplete}
      maxFileSize={5 * 1024 * 1024}  // Optional: 5MB default
      allowedTypes={['image/jpeg', 'image/png']}  // Optional
    />
  );
}
```

#### Protecting Routes with Authentication

```tsx
import { useAuth } from './context/AuthContext';

function ProtectedComponent() {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAdmin) {
    return <div>Access Denied</div>;
  }

  return <div>Protected Content</div>;
}
```

## 🌐 API Integration (Production)

Currently, images are stored in browser memory. To integrate with your backend:

1. **Update the upload logic in `ImageUpload.tsx`:**

```tsx
const uploadFiles = async (files: FileList | File[]) => {
  const formData = new FormData();
  fileArray.forEach(file => formData.append('images', file));

  const response = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: formData
  });

  const data = await response.json();
  setImages(prev => [...prev, ...data.images]);
};
```

2. **Update login logic in `AuthContext.tsx`:**
   - Replace the demo credentials with actual API calls
   - Handle JWT tokens properly
   - Add token refresh logic

## 🎨 Customization

### Colors & Theme
The app uses Tailwind CSS with a custom color scheme:
- Primary: Cyan (500-600)
- Secondary: Purple (500-900)
- Background: Slate (800-900)
- Accents: Gradients from cyan to blue

### Modify Upload Limits
In `ImageUpload.tsx`, adjust these constants:

```tsx
const MAX_FILE_SIZE = 10 * 1024 * 1024; // Change to 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png']; // Restrict types
```

## 🔒 Security Considerations

### For Production:
1. ✅ Implement proper JWT authentication
2. ✅ Use HTTPS for all API calls
3. ✅ Validate file types on the server
4. ✅ Implement rate limiting for uploads
5. ✅ Store tokens in httpOnly cookies instead of localStorage
6. ✅ Add CSRF protection
7. ✅ Implement file scanning for malware
8. ✅ Use signed URLs for image storage

## 📦 Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Context API** - State management

## 🚀 Deployment

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Preview production build:**
   ```bash
   npm run preview
   ```

3. **Deploy the `dist` folder** to your hosting service (Vercel, Netlify, etc.)

## 📝 License

MIT License - Feel free to use this in your projects!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ for AutoMart
