import express, { urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { rateLimit } from 'express-rate-limit';
import session from 'express-session';
import userRoutes from './modules/user/v1/routes/user.route';
import projectRoutes from './modules/project/v1/routes/project.route';
import teamRoutes from './modules/teams/v1/routes/team.route';
import taskRoutes from './modules/tasks/v1/routes/task.route';
import calendarRoutes from './modules/calendar/v1/routes/calendar.route';
import logger from './core/utils/logger';
import passport from 'passport';
import './core/config/google';

//test
import './modules/tasks/v1/events/taskSyncListener';

const app = express();

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
};
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(
  session({
    secret: process.env.JWT_SECRET!,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(limiter);
app.use(passport.initialize());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    res.status(400).json({ message: 'Validation failed', errors: err.errors });
  }
  logger.error(err);
  res.status(500).json(err.message);
});

app.use('/v1/users', userRoutes);
app.use('/v1/projects', projectRoutes);
app.use('/v1/teams', teamRoutes);
app.use('/v1/tasks', taskRoutes);
app.use('/v1/calendar', calendarRoutes);

export default app;
