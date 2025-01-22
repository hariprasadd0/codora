import express, { urlencoded } from 'express';
import cors from 'cors';
import userRoutes from './modules/user/v1/routes/user.route';

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(urlencoded({ extended: true }));

//URLS
app.use('/v1/users', userRoutes);

export default app;
