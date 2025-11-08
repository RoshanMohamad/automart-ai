# Automart AI Server

Backend API server for Automart AI - A full-stack application with user authentication, post management, and session handling.

## 🚀 Features

### Authentication & Authorization
- **User Registration** - Create new user accounts with email and password
- **User Login** - Session-based authentication with secure password hashing
- **Password Encryption** - bcrypt hashing with salt rounds for secure password storage
- **Session Management** - Express sessions with Redis store support (fallback to MemoryStore)
- **Protected Routes** - Middleware-based route protection for authenticated users

### Post Management (CRUD)
- **Create Posts** - Authenticated users can create posts with title and content
- **Read Posts** - Fetch all posts or individual posts by ID
- **Update Posts** - Edit existing posts (protected route)
- **Delete Posts** - Remove posts (protected route)
- **Flexible Payload Support** - Accepts multiple payload formats:
  - `{ title, content }`
  - `{ title, body }` (body maps to content)
  - `{ post: { title, content } }` (wrapped payload)

### User Management
- **Get All Users** - Retrieve list of all registered users
- **Unique Constraints** - Username and email uniqueness validation
- **User Model** - MongoDB schema with validation rules

### API Features
- **RESTful API** - Standard HTTP methods and status codes
- **JSON API** - All requests and responses use JSON format
- **CORS Enabled** - Cross-Origin Resource Sharing configured for client access
- **Error Handling** - Comprehensive error responses with appropriate status codes
- **Input Validation** - Request body validation for required fields

## 🛠️ Tech Stack

- **Runtime**: Node.js v22.20.0
- **Framework**: Express.js v5.1.0
- **Database**: MongoDB (via Mongoose v8.19.2)
- **Session Store**: Redis v5.9.0 with connect-redis v9.0.0
- **Authentication**: bcryptjs v3.0.3
- **Session Management**: express-session v1.18.2
- **CORS**: cors v2.8.5
- **Dev Tools**: nodemon v3.1.10

## 📁 Project Structure

```
server/
├── config/
│   └── config.js              # Environment configuration
├── controller/
│   ├── postController.js      # Post CRUD operations
│   └── userController.js      # User authentication & management
├── middleware/
│   └── authMiddleware.js      # Authentication middleware
├── models/
│   ├── postModel.js           # Post schema
│   └── userModel.js           # User schema
├── routes/
│   ├── postRouters.js         # Post endpoints
│   └── userRoutes.js          # User endpoints
├── docker-compose.dev.yml     # Development Docker setup
├── docker-compose.yml         # Production Docker setup
├── Dockerfile                 # Docker image configuration
├── package.json               # Dependencies
└── server.js                  # Application entry point
```

## 🔧 Setup & Installation

### Prerequisites
- Docker & Docker Compose
- Node.js v22.20.0 (for local development)

### Environment Variables

The following environment variables can be configured (defaults provided):

```env
# MongoDB Configuration
MONGO_IP=mongo-db
MONGO_PORT=27017
MONGO_USER=root
MONGO_PASSWORD=rootpassword
MONGO_DB=automart-ai

# Redis Configuration
REDIS_URL=redis
REDIS_PORT=6379

# Session Configuration
SESSION_SECRET=secret

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Development Setup (Docker)

1. **Clone the repository**
   ```bash
   git clone https://github.com/RoshanMohamad/automart-ai.git
   cd automart-ai/server
   ```

2. **Start development environment**
   ```cmd
   docker compose -f docker-compose.dev.yml up --build -d
   ```

3. **View logs**
   ```cmd
   docker logs server-automart-server-1 -f
   ```

4. **Stop environment**
   ```cmd
   docker compose -f docker-compose.dev.yml down
   ```

### Local Development (Without Docker)

1. **Install dependencies**
   ```cmd
   npm install
   ```

2. **Set up MongoDB and Redis** (ensure they're running locally)

3. **Configure environment variables** (create `.env` file or export)

4. **Run development server**
   ```cmd
   npm run dev
   ```

## 📡 API Endpoints

### Base URL
```
http://localhost:3000
```

### User Endpoints

#### Register User
```http
POST /api/v1/users/signup
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (201 Created):**
```json
{
  "message": "User created successfully",
  "data": {
    "newUser": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com"
    }
  }
}
```

#### Login User
```http
POST /api/v1/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

#### Get All Users
```http
GET /api/v1/users
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com"
    }
  ]
}
```

### Post Endpoints

#### Get All Posts
```http
GET /api/v1/posts
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "My First Post",
      "content": "This is the content of my first post."
    }
  ]
}
```

#### Create Post (Protected)
```http
POST /api/v1/posts
Content-Type: application/json
Cookie: connect.sid=<session-cookie>

{
  "title": "New Post Title",
  "content": "Post content goes here"
}
```

**Alternative payload formats:**
```json
{ "title": "New Post", "body": "Content here" }
```
```json
{ "post": { "title": "New Post", "content": "Content here" } }
```

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "New Post Title",
  "content": "Post content goes here"
}
```

#### Get Post by ID
```http
GET /api/v1/posts/:id
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "My First Post",
  "content": "This is the content of my first post."
}
```

#### Update Post (Protected)
```http
PUT /api/v1/posts/:id
Content-Type: application/json
Cookie: connect.sid=<session-cookie>

{
  "title": "Updated Title",
  "content": "Updated content"
}
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Updated Title",
  "content": "Updated content"
}
```

#### Delete Post (Protected)
```http
DELETE /api/v1/posts/:id
Cookie: connect.sid=<session-cookie>
```

**Response (204 No Content)**

### Error Responses

**400 Bad Request:**
```json
{
  "message": "Missing required fields: title and content (or body)."
}
```

**401 Unauthorized:**
```json
{
  "message": "Unauthorized: Please log in to access this resource."
}
```

**404 Not Found:**
```json
{
  "message": "Post not found"
}
```

**500 Internal Server Error:**
```json
{
  "message": "Error creating post"
}
```

## 🐳 Docker Configuration

### Development (`docker-compose.dev.yml`)

**Features:**
- Hot reload with nodemon
- Volume mounts for live code changes
- MongoDB with persistent volume
- Exposed ports for local access
- Development environment variables

**Services:**
- `automart-server` - Node.js API server (port 3000)
- `mongo-db` - MongoDB database (port 27017)

**Volumes:**
- Source code mounted to `/server`
- `node_modules` excluded from mount
- MongoDB data persisted in named volume

### Production (`docker-compose.yml`)

**Features:**
- Optimized for production
- No volume mounts
- Production-only dependencies
- Minimal image size

## 🔒 Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **HTTP-Only Cookies**: Prevents XSS attacks
- **Session Secrets**: Configurable session secret
- **CORS Configuration**: Restricted to allowed origins
- **Input Validation**: Required field validation
- **Authentication Middleware**: Route-level protection

## 🧪 Testing the API

### Using curl (Windows CMD)

**Register a user:**
```cmd
curl -X POST http://localhost:3000/api/v1/users/signup ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

**Login:**
```cmd
curl -X POST http://localhost:3000/api/v1/users/login ^
  -H "Content-Type: application/json" ^
  -c cookies.txt ^
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

**Create a post (with session):**
```cmd
curl -X POST http://localhost:3000/api/v1/posts ^
  -H "Content-Type: application/json" ^
  -b cookies.txt ^
  -d "{\"title\":\"My Post\",\"content\":\"Post content\"}"
```

### Using PowerShell

```powershell
# Register user
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/users/signup" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login and save session
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/users/login" `
  -Method POST `
  -ContentType "application/json" `
  -WebSession $session `
  -Body '{"email":"test@example.com","password":"password123"}'

# Create post with session
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/posts" `
  -Method POST `
  -ContentType "application/json" `
  -WebSession $session `
  -Body '{"title":"My Post","content":"Post content"}'
```

## 📊 Database Schema

### User Model
```javascript
{
  username: String (required, unique, trimmed),
  email: String (required, unique, trimmed),
  password: String (required, min 6 characters, hashed)
}
```

### Post Model
```javascript
{
  title: String (required),
  content: String (required)
}
```

## 🔧 Troubleshooting

### Server won't start
- Check Docker containers are running: `docker ps`
- View logs: `docker logs server-automart-server-1`
- Ensure ports 3000 and 27017 are available

### MongoDB connection issues
- Verify MongoDB container is running
- Check MONGO_IP, MONGO_PORT environment variables
- Ensure authentication credentials are correct

### Session/Cookie issues
- Verify CORS origin matches your client URL
- Check that `credentials: true` is set in client requests
- Ensure SESSION_SECRET is configured

### Hot reload not working
- Volume mounts must be correctly configured
- Use nodemon's `-L` flag for Docker/WSL compatibility
- Check file changes are being detected

## 🚧 Known Issues & Limitations

- **Redis Store**: Falls back to MemoryStore if Redis connection fails (sessions won't persist across server restarts in dev mode)
- **Deprecated Options**: MongoDB useNewUrlParser and useUnifiedTopology warnings (harmless, can be removed)
- **connect-redis**: May require specific version compatibility with redis client

## 📝 Development Notes

### Code Changes
All code changes made on the host are automatically synced to the container via volume mounts in development mode. Nodemon watches for changes and restarts the server automatically.

### Database Access
MongoDB is exposed on `localhost:27017` and can be accessed using:
```cmd
docker exec -it server-mongo-db-1 mongosh -u root -p rootpassword --authenticationDatabase admin
```

### Adding New Dependencies
1. Add to `package.json`
2. Rebuild Docker image: `docker compose -f docker-compose.dev.yml up --build -d`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

[Add your license here]

## 👤 Author

**Roshan Mohamad**
- GitHub: [@RoshanMohamad](https://github.com/RoshanMohamad)

## 🔗 Related

- [Client Application](../client/README.md)
- [AI Service](../ai-service/)

---

**Last Updated:** November 8, 2025
