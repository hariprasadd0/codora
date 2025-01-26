import express from 'express';
import {
  getUserById,
  createUser,
  updateUser,
  loginUser,
} from '../controllers/user.controller';
import { validateSchema } from '../../../../core/middlewares/validateSchema';
import { createUserSchema } from '../schema/user.schema';
const router = express.Router();

router.post('/', validateSchema(createUserSchema), createUser);
router.post('/login', loginUser);
router.get('/:id', getUserById);
router.patch('/me', updateUser);

export default router;
