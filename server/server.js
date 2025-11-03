const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
const {
  MONGO_IP,
  MONGO_PORT,
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_DB,
  REDIS_URL,
  REDIS_PORT,
  SESSION_SECRET
} = require('./config/config');

const session = require('express-session');
// Use redis v4 createClient and support different connect-redis export shapes
const { createClient } = require('redis');

let RedisStore;
try {
  // connect-redis may export a function or an object with default
  const connectRedis = require('connect-redis');
  const connector = typeof connectRedis === 'function' ? connectRedis : (connectRedis && connectRedis.default ? connectRedis.default : null);
  if (!connector) throw new Error('connect-redis export not recognized');
  RedisStore = connector(session);
} catch (err) {
  console.error('Failed to initialize connect-redis store:', err.message);
  // RedisStore will remain undefined and session will fall back to default MemoryStore
}

// Create redis client and connect (use redis URL)
const redisClient = createClient({ url: `redis://${REDIS_URL}:${REDIS_PORT}` });
redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.connect().catch((err) => console.error('Redis connect error:', err));

const cors = require('cors');

app.use(express.json({ limit: '10kb', strict: true, type: 'application/json' }));

// Enable CORS for the client during development and allow cookies
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));


app.enable('trust proxy');
// Configure session; if RedisStore failed to initialize, fall back to default MemoryStore
const sessionOptions = {
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // if true: only transmit cookie over https
    httpOnly: true, // if true: prevents client side JS from reading the cookie
    maxAge: 1000 * 60 * 10, // session max age in milliseconds
  },
};
if (RedisStore) {
  try {
    sessionOptions.store = new RedisStore({ client: redisClient });
  } catch (err) {
    console.error('Failed to create RedisStore instance:', err.message);
  }
}
app.use(session(sessionOptions));

// Register routes after session and CORS so handlers can access req.session and cookies
const postRoutes = require('./routes/postRouters');
const userRoutes = require('./routes/userRoutes');
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/users', userRoutes);


// MongoDB connection
mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

app.get('/api/v1', (req, res) => {
  res.send('Hello from, Automart AI Server and Express. new change!');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  // console.log(`https://localhost:${port}`);
})
