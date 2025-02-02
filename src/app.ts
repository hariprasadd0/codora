import express, { urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { Request, Response, NextFunction } from 'express';
import userRoutes from './modules/user/v1/routes/user.route';
import projectRoutes from './modules/project/v1/routes/project.route';
import teamRoutes from './modules/teams/v1/routes/team.route';
import logger from './core/utils/logger';

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message);
  res.status(500).send('Something went wrong');
});

//URLS
// app.get('/health', (req, res) => {
//   res.status(200).send('OK');
// });

app.use('/v1/users', userRoutes);
app.use('/v1/projects', projectRoutes);
app.use('/v1/teams', teamRoutes);

export default app;
