import prisma from '../../../../core/config/prisma';
import { createTaskDto, updateTaskDto } from '../schema/task.schema';
import { ApiError } from '../../../../core/utils/ApiError';
import logger from '../../../../core/utils/logger';

export const TaskRepository = {
  addTask: async (projectId: string, tasks: createTaskDto) => {
    const task = await prisma.task.create({
      data: {
        projectId,
        ...tasks,
      },
    });
    return task;
  },
  getProject: async (projectId: string) => {
    return prisma.project.findUnique({
      where: { id: projectId },
    });
  },
  checkDependecny: async (dependencyTaskId: string) => {
    return await prisma.task.findUnique({
      where: { id: dependencyTaskId },
      select: { projectId: true },
    });
  },
  checkAssigned: async (assignedToId: string) => {
    return await prisma.user.findUnique({
      where: { id: assignedToId },
    });
  },
  alreadyAssigned: async (taskId: string, userId: string) => {
    return await prisma.task.findUnique({
      where: { id: taskId, assignedToId: userId },
    });
  },
  getTaskById: async (taskId: string) => {
    return await prisma.task.findUnique({
      where: { id: taskId },
    });
  },
  getAllTasksByProject: async (projectId: string) => {
    return await prisma.task.findMany({
      where: { projectId },
    });
  },
  listAllTask: async (userId: string) => {
    return await prisma.task.findMany({
      where:{
        assignedToId:userId,
      },
      include: {
        project : {
          select : {
            id: true,
            name : true
          }
        }
      }
    })
  },
  assignTask: async (userId: string, taskId: string) => {
    return await prisma.task.update({
      where: { id: taskId },
      data: {
        assignedToId: userId,
      },
    });
  },
  updateTask: async (taskId: string, task: Partial<updateTaskDto>) => {
    return await prisma.task.update({
      where: { id: taskId },
      data: {
        ...task,
      },
    });
  },

  deleteTask: async (taskId: string) => {
    return await prisma.task.delete({
      where: { id: taskId },
    });
  },

  assignTaskTransactional: async (taskId: string, assignedToId: string) => {
    return await prisma.$transaction(async (tx) => {
      const [task, user] = await Promise.all([
        tx.task.findFirst({ where: { id: taskId } }),
        tx.user.findFirst({ where: { id: assignedToId } }),
      ]);

      if (!task) {
        logger.error(`Task not found: ${taskId}`);
        throw new ApiError(404, 'Task not found');
      }

      if (!user) {
        logger.error(`User not found: ${assignedToId}`);
        throw new ApiError(400, 'Assigned user not found');
      }

      if (task.assignedToId === assignedToId) {
        throw new ApiError(400, 'User Already Assigned to the task');
      }

      const project = await prisma.project.findUnique({
        where: { id: task.projectId },
      });
      if (!project) throw new ApiError(404, 'Project not found');
      const teamId = project.teamId!;

      if (project.teamId) {
        const isTeamMember = await prisma.teamMember.findUnique({
          where: { teamId_userId: { teamId, userId: assignedToId } },
        });
        if (!isTeamMember) {
          throw new ApiError(400, 'User is not a member of this team');
        }
      } else {
        if (assignedToId !== project.createdById) {
          throw new ApiError(
            400,
            'Cannot assign task in solo mode to someone else'
          );
        }
      }
      // Assign the task
      return await tx.task.update({
        where: { id: taskId },
        data: { assignedToId },
      });
    });
  },
  //for testing
  getUser: async (userId: string) => {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        googleAccessToken: true,
        googleRefreshToken: true,
      },
    });
  },
};
