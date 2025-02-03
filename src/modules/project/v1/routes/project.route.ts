import { Router } from 'express';
import {
  createProjectController,
  getProjectController,
  listProjectController,
  updateProjectController,
  deleteProjectController,
} from '../controllers/project.controller';
import { verifyJwt } from '../../../../core/middlewares/auth.middleware';
import { validateSchema } from '../../../../core/middlewares/validateSchema';
import { createProjectSchema } from '../schema/project.schema';

const router = Router();

router.post(
  '/',
  verifyJwt,
  validateSchema(createProjectSchema),
  createProjectController
);
router.get('/:projectId', verifyJwt, getProjectController);
router.get('/', verifyJwt, listProjectController);
router.patch('/:projectId', verifyJwt, updateProjectController);
router.delete('/:projectId', verifyJwt, deleteProjectController);

router.post(':projectId/convert-to-team');
router.post(':projectId/team');

export default router;
