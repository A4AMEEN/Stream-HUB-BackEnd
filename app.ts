import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import { createProxyMiddleware } from 'http-proxy-middleware';
import connectDB from './src/providers/database';
import userRoutes from './src/routes/userRoutes';
import adminRoutes from './src/routes/adminRoutes';

const app = express();
connectDB()
// Middleware to enable CORS
const corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

// Session middleware
app.use(session({
  secret: 'session123',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
// app.use('/api/auth', userRoutes);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);


// Proxy requests to the Angular development server

app.use('/', createProxyMiddleware({ target: 'http://localhost:4200', changeOrigin: true }));

export default app;
