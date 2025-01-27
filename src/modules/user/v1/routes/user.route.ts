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
import { createUserSchema } from '../schema/user.schema';
const router = express.Router();

router.post('/register', validateSchema(createUserSchema), createUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/:id', getUserById);
router.patch('/me', updateUser);

router.get('/', getAllUsers);
export default router;
