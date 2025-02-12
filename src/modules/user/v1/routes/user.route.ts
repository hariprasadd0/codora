import express from 'express';
import passport from 'passport';
import {
  getUserById,
  createUser,
  updateUser,
  loginUser,
  logoutUser,
  getAllUsers,
  refreshToken,
} from '../controllers/user.controller';
import { validateSchema } from '../../../../core/middlewares/validateSchema';
import { createUserSchema, loginUserSchema } from '../schema/user.schema';
import { verifyJwt } from '../../../../core/middlewares/auth.middleware';
import '../../../../core/config/google';
const router = express.Router();

//google
router.get('/google', (req, res, next) => {
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, next);
});

router.get(
  '/google/redirect',
  passport.authenticate('google', { session: false }),
  (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication failed' });
    }

    const { accessToken, refreshToken } = req.user as any;

    // Store refresh token in HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: 'Google login successful', accessToken });
  }
);

router.post('/register', validateSchema(createUserSchema), createUser);
router.post('/login', validateSchema(loginUserSchema), loginUser);
router.post('/logout', logoutUser);
router.get('/:id', verifyJwt, getUserById);
router.patch('/me', verifyJwt, updateUser);
router.post('/refresh', refreshToken);

router.get('/', verifyJwt, getAllUsers);

export default router;
