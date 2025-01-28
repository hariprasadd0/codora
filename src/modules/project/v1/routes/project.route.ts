import { Router } from 'express';
import {
  createProjectController,
  getProjectController,
  listProjectController,
  updateProjectController,
  deleteProjectController,
} from '../controllers/project.controller';

const router = Router();

router.post('/', createProjectController);
router.get('/:projectId', getProjectController);
router.get('/', listProjectController);
router.patch('/:projectId', updateProjectController);
router.delete('/:projectId', deleteProjectController);

export default router;
