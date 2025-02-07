import prisma from '../../../../core/config/prisma';
import { createTaskDto, updateTaskDto } from '../schema/task.schema';

export const TaskRepository = {
  addTask: async (projectId: number, tasks: createTaskDto) => {
    return await prisma.task.create({
      data: {
        projectId,
        ...tasks,
      },
    });
  },
  getProject: async (projectId: number) => {
    return prisma.project.findUnique({
      where: { id: projectId },
    });
  },
  checkDependecny: async (dependencyTaskId: number) => {
    return await prisma.task.findUnique({
      where: { id: dependencyTaskId },
      select: { projectId: true },
    });
  },
  checkAssigned: async (assignedToId: number) => {
    return await prisma.user.findUnique({
      where: { id: assignedToId },
    });
  },
  getTaskById: async (taskId: number) => {
    return await prisma.task.findUnique({
      where: { id: taskId },
    });
  },
  getAllTasksByProject: async (projectId: number) => {
    return await prisma.task.findMany({
      where: { projectId },
    });
  },
  assignTask: async (userId: number, taskId: number) => {
    return await prisma.task.update({
      where: { id: taskId },
      data: {
        assignedToId: userId,
      },
    });
  },
  updateTask: async (taskId: number, task: Partial<updateTaskDto>) => {
    return await prisma.task.update({
      where: { id: taskId },
      data: {
        ...task,
      },
    });
  },
  deleteTask: async (taskId: number) => {
    return await prisma.task.delete({
      where: { id: taskId },
    });
  },
};
