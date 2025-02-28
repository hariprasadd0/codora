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
} from '../controllers/task.controllers';

const router = Router();

router.post(
  '/:projectId',
  verifyJwt,
  validateSchema(createTaskSchema),
  createTaskController
);

//get single task

router.get('/:taskId', verifyJwt, getTaskByIdController);

//get all tasks for a project
router.get('/project/:projectId', verifyJwt, getAllTasksController);

//assign task to a user
router.patch('/:taskId/assign', assignTaskController);

//update status
router.patch(':id/status');
//update priority
router.patch(':id/priority');
//add dependency
router.patch(':id/dependency');

//remove dependency

//update tasks
router.put('/:taskId', verifyJwt, updateTaskController);

//delete task
router.delete('/:taskId', verifyJwt, deleteTaskController);

//sync task to calendar
router.post('/:taskId/sync', verifyJwt, syncTaskToCalendarController);

export default router;
