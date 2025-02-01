import express from 'express';
import {
  getUserById,
  createUser,
  updateUser,
  loginUser,
  logoutUser,
  getAllUsers,
} from '../controllers/user.controller';
import { validateSchema } from '../../../../core/middlewares/validateSchema';
import { createUserSchema, loginUserSchema } from '../schema/user.schema';
import { verifyJwt } from '../../../../core/middlewares/auth.middleware';
const router = express.Router();

router.post('/register', validateSchema(createUserSchema), createUser);
router.post('/login', validateSchema(loginUserSchema), loginUser);
router.post('/logout', logoutUser);
router.get('/:id', verifyJwt, getUserById);
router.patch('/me', verifyJwt, updateUser);

router.get('/', getAllUsers);
export default router;
