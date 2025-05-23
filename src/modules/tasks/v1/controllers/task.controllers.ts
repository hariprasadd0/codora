import asyncHandler from '../../../../core/utils/asyncHandler';
import { ApiError } from '../../../../core/utils/ApiError';
import { Request, Response } from 'express';
import { createTaskSchema, updateTaskSchema } from '../schema/task.schema';
import * as TaskServices from '../services/task.service';

/**
 * Create a new task in a project
 */
export const createTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.projectId;
    const projectId = id;
    if (!projectId) throw new ApiError(400, 'Project ID not found');

    const validatedTask = createTaskSchema.parse(req.body);

    const tasks = await TaskServices.createTaskService(
      projectId,
      validatedTask
    );

    res.status(201).json({
      data: tasks,
      meta: {
        version: '1.0',
        timestamp: new Date().toISOString(),
      },
    });
  }
);

/**
 * Update a task
 */
export const updateTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.taskId;
    const taskId = id;
    if (!taskId) throw new ApiError(400, 'Task ID not found');

    const updateData = updateTaskSchema.parse(req.body);

    const updatedTask = await TaskServices.updateTaskService(
      taskId,
      updateData
    );

    res.status(200).json({
      data: updatedTask,
      message: 'Task updated successfully',
    });
  }
);

/**
 * Get a task by ID
 */
export const getTaskByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const {taskId} = req.params;
    if (!taskId) throw new ApiError(400, 'Task ID not found');

    const task = await TaskServices.getTaskByIdService(taskId);

    res.status(200).json({ task });
  }
);

/**
 * Get all tasks for a project
 */
export const getAllTasksController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.projectId;
    const projectId = id;
    if (!projectId) throw new ApiError(400, 'Project ID not found');

    const tasks = await TaskServices.getAllTasksService(projectId);

    res.status(200).json({ data: tasks });
  }
);

export const listAllTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = (req as any).user.userId;
    if (!id) throw new ApiError(400, 'User ID not found');
    const tasks = await TaskServices.listAllTasksService(id);
    res.status(200).json(tasks);
  }
);

/**
 * Delete a task
 */
export const deleteTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.taskId;
    const taskId = id;
    if (!taskId) throw new ApiError(400, 'Task ID not found');

    await TaskServices.deleteTaskService(taskId);

    res.status(200).json({ message: 'Task deleted successfully' });
  }
);

/**
 * Assign a task to a user
 */
export const assignTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const { assignedToId } = req.body;

    const assignee = assignedToId;

    if (!assignedToId) throw new ApiError(400, 'assignedToId not found');

    const id = req.params.taskId;
    const taskId = id;
    if (!taskId) throw new ApiError(400, 'Task ID not found');

    const updatedTask = await TaskServices.assignTaskService(taskId, assignee);

    res.status(200).json({
      data: updatedTask,
      message: `Task ${taskId} assigned to user ${assignedToId}`,
    });
  }
);

export const syncTaskToCalendarController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.taskId;
    const taskId = id;
    if (!taskId) throw new ApiError(400, 'Task ID not found');

    await TaskServices.syncTaskToCalendarService(taskId);

    res.status(200).json({ message: 'Task synced to calendar' });
  }
);

export const updateTaskStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.taskId;
    const taskId = id;
    if (!taskId) throw new ApiError(400, 'Task ID not found');

    const { status } = req.body;

    if (!status) throw new ApiError(400, 'Status not found');

    const updatedTask = await TaskServices.updateTaskStatusService(
      taskId,
      status
    );

    res.status(200).json({
      data: updatedTask,
      message: 'Task status updated successfully',
    });
  }
);

export const updateTaskPriorityController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.taskId;
    const taskId = id;
    if (!taskId) throw new ApiError(400, 'Task ID not found');

    const { priority } = req.body;

    if (!priority) throw new ApiError(400, 'Priority not found');

    const updatedTask = await TaskServices.updateTaskPriorityService(
      taskId,
      priority
    );

    res.status(200).json({
      data: updatedTask,
      message: 'Task priority updated successfully',
    });
  }
);
