import { ApiError } from '../../../../core/utils/ApiError';
import logger from '../../../../core/utils/logger';
import { TaskRepository } from '../repositories/task.repository';
import { createTaskDto, updateTaskDto } from '../schema/task.schema';
import { getSocketInstance } from '../../../../core/utils/socket';
import { syncTaskToCalendar } from '../../../../core/utils/calendarSync';
import { Priority, Status } from '@prisma/client';
/**
 * Create a new task within a project
 */
export const createTaskService = async (
  projectId: number,
  task: createTaskDto
) => {
  // Check if project exists
  const project = await TaskRepository.getProject(projectId);
  if (!project) {
    logger.error(`Project not found: ${projectId}`);
    throw new ApiError(404, 'Project not found');
  }

  // Validate dependency task
  if (task.dependencyTaskId) {
    const dependencyTask = await TaskRepository.checkDependecny(
      task.dependencyTaskId
    );
    if (!dependencyTask || dependencyTask.projectId !== projectId) {
      logger.error(`Invalid task dependency: ${task.dependencyTaskId}`);
      throw new ApiError(
        400,
        'Dependency task not found or belongs to a different project'
      );
    }
  }

  // Validate assigned user
  if (task.assignedToId) {
    const user = await TaskRepository.checkAssigned(task.assignedToId);
    if (!user) {
      logger.error(`User not found: ${task.assignedToId}`);
      throw new ApiError(400, 'Assigned user not found');
    }
  }

  // Create task
  const taskCreated = await TaskRepository.addTask(projectId, task);
  const io = getSocketInstance();
  io.to(`project-${projectId}`).emit('TaskCreated', taskCreated);

  logger.info(`Task created: ${taskCreated.id}`);
  return taskCreated;
};

/**
 * Assign a task to a user
 */
export const assignTaskService = async (
  taskId: number,
  assignedToId: number
) => {
  const updatedTask = await TaskRepository.assignTaskTransactional(
    taskId,
    assignedToId
  );

  const io = getSocketInstance();
  io.to(`project-${updatedTask.projectId}`).emit('TaskAssigned', updatedTask);
  logger.info(`Task assigned: Task ${taskId} -> User ${assignedToId}`);
  return updatedTask;
};

/**
 * Update a task's details
 */
export const updateTaskService = async (
  taskId: number,
  updateData: updateTaskDto
) => {
  // Check if task exists
  const task = await TaskRepository.getTaskById(taskId);
  if (!task) {
    logger.error(`Task not found: ${taskId}`);
    throw new ApiError(404, 'Task not found');
  }

  // Update task
  const updatedTask = await TaskRepository.updateTask(taskId, updateData);
  logger.info(`Task updated: ${taskId}`);
  return updatedTask;
};

/**
 * Get a task by ID
 */
export const getTaskByIdService = async (taskId: number) => {
  const task = await TaskRepository.getTaskById(taskId);
  if (!task) {
    logger.error(`Task not found: ${taskId}`);
    throw new ApiError(404, 'Task not found');
  }
  return task;
};

/**
 * Get all tasks for a project
 */
export const getAllTasksService = async (projectId: number) => {
  const project = await TaskRepository.getProject(projectId);
  if (!project) {
    logger.error(`Project not found: ${projectId}`);
    throw new ApiError(404, 'Project not found');
  }

  const tasks = await TaskRepository.getAllTasksByProject(projectId);
  return tasks;
};

/**
 * Delete a task
 */
export const deleteTaskService = async (taskId: number) => {
  const task = await TaskRepository.getTaskById(taskId);
  if (!task) {
    logger.error(`Task not found: ${taskId}`);
    throw new ApiError(404, 'Task not found');
  }

  await TaskRepository.deleteTask(taskId);
  logger.info(`Task deleted: ${taskId}`);
  return { message: 'Task deleted successfully' };
};

export const syncTaskToCalendarService = async (taskId: number) => {
  const task = await TaskRepository.getTaskById(taskId);
  if (!task) {
    logger.error(`Task not found: ${taskId}`);
    throw new ApiError(404, 'Task not found');
  }
  const userId = task.assignedToId;
  if (!userId) {
    throw new ApiError(400, 'Task not assigned');
  }
  const user = await TaskRepository.getUser(userId);
  if (!user?.googleAccessToken || !user.googleRefreshToken) {
    throw new ApiError(400, 'Google Calendar not connected');
  }

  const result = await syncTaskToCalendar(task.id, {
    accessToken: user.googleAccessToken,
    refreshToken: user.googleRefreshToken,
  });
  return result;
};

/**
 * Update task status
 */
export const updateTaskStatusService = async (
  taskId: number,
  status: Status
) => {
  const task = await TaskRepository.getTaskById(taskId);

  if (!task) {
    logger.error(`Task not found: ${taskId}`);
    throw new ApiError(404, 'Task not found');
  }
  const validStatus = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELAYED'];
  if (!validStatus.includes(status)) {
    logger.error(`Invalid status: ${status}`);
    throw new ApiError(400, 'Invalid status');
  }
  const updatedTask = await TaskRepository.updateTask(taskId, { status });
  return updatedTask;
};

/**
 * Update task priority
 */
export const updateTaskPriorityService = async (
  taskId: number,
  priority: Priority
) => {
  const task = await TaskRepository.getTaskById(taskId);

  if (!task) {
    logger.error(`Task not found: ${taskId}`);
    throw new ApiError(404, 'Task not found');
  }
  const updatedTask = await TaskRepository.updateTask(taskId, { priority });
  return updatedTask;
};
