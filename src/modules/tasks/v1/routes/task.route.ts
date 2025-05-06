import { Router } from 'express';
import { validateSchema } from '../../../../core/middlewares/validateSchema';
import { createTaskSchema } from '../schema/task.schema';
import { verifyJwt } from '../../../../core/middlewares/auth.middleware';
import {
  createTaskController,
  getTaskByIdController,
  getAllTasksController,
  deleteTaskController,
  assignTaskController,
  updateTaskController,
  syncTaskToCalendarController,
  updateTaskStatusController,
  updateTaskPriorityController,
  listAllTaskController,
} from '../controllers/task.controllers';

const router = Router();

router.get('/all-tasks', verifyJwt, listAllTaskController);
router.post('/project/:projectId', verifyJwt, validateSchema(createTaskSchema), createTaskController);
router.get('/project/:projectId', verifyJwt, getAllTasksController);
router.get('/:id', verifyJwt, getTaskByIdController);
router.put('/:taskId', verifyJwt, updateTaskController);
router.delete('/:taskId', verifyJwt, deleteTaskController);
router.patch('/:taskId/assign', verifyJwt, assignTaskController);
router.patch('/:taskId/status', verifyJwt, updateTaskStatusController);
router.patch('/:taskId/priority', verifyJwt, updateTaskPriorityController);
router.patch('/:taskId/dependency', verifyJwt);
router.post('/:taskId/sync', verifyJwt, syncTaskToCalendarController);

export default router;
