import { Router } from 'express';
import {
  createProjectController,
  getProjectController,
  listProjectController,
  updateProjectController,
} from '../controllers/project.controller';

const router = Router();

router.post('/', createProjectController);
router.get('/:projectId', getProjectController);
router.get('/', listProjectController);
router.patch('/:projectId', updateProjectController);
