import { Router } from 'express';
import {
  createProjectController,
  getProjectController,
  listProjectController,
  updateProjectController,
  deleteProjectController,
  convertToTeamController,
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
router.get('/all-projects', verifyJwt, listProjectController);
router.get('/:projectId', verifyJwt, getProjectController);
router.patch('/:projectId', verifyJwt, updateProjectController);
router.delete('/:projectId', verifyJwt, deleteProjectController);

router.post('/:projectId/team', verifyJwt, convertToTeamController);

export default router;
