import express from 'express';
import { getUserById, createUser } from '../controllers/user.controller';
import { validateSchema } from '../../../../core/middlewares/validateSchema';
import { createUserSchema } from '../schema/user.schema';
const router = express.Router();

router.post('/', validateSchema(createUserSchema), createUser);
router.get('/:id', getUserById);

export default router;
