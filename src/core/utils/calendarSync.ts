import { getOAuthClient } from './calendar';
import { google } from 'googleapis';
import prisma from '../config/prisma';
import logger from './logger';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedToId: number;
  dependencyTaskId: number;
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
}

const oAuth2Client = getOAuthClient();
if (!oAuth2Client) {
  throw new Error('OAuth2 client not found');
}

export const bulkSync = async (
  tasks: Task[],
  googleCredentials: { accessToken: string; refreshToken: string }
) => {
  try {
    oAuth2Client.setCredentials({
      access_token: googleCredentials.accessToken,
      refresh_token: googleCredentials.refreshToken,
    });
    const calendar = google.calendar({
      version: 'v3',
      auth: oAuth2Client,
    });

    const events = [];

    for (const task of tasks) {
      if (!task.deadline) {
        continue;
      }
      const event = {
        summary: task.title,
        description: task.description,
        start: {
          dateTime: task.deadline.toISOString(),
          timeZone: 'UTC',
        },
        end: {
          dateTime: new Date(
            task.deadline.getTime() + 60 * 60 * 1000
          ).toISOString(),
          timeZone: 'UTC',
        },
      };

      const res = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
      });
      events.push(res.data);
    }
    return events;
  } catch (error) {
    logger.error('Error syncing tasks to Google Calendar', error);
    throw new Error('Error syncing tasks to Google Calendar');
  }
};

export const syncTaskToCalendar = async (
  taskId: number,
  googleCredentials: { accessToken: string; refreshToken: string }
) => {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
  });
  if (!task) {
    throw new Error('Task not found');
  }
  try {
    oAuth2Client.setCredentials({
      access_token: googleCredentials.accessToken,
      refresh_token: googleCredentials.refreshToken,
    });
    const calendar = google.calendar({
      version: 'v3',
      auth: oAuth2Client,
    });

    const event = {
      summary: task.name,
      description: task.description,
      start: {
        dateTime: task.deadline!.toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: new Date(
          task.deadline!.getTime() + 60 * 60 * 1000
        ).toISOString(),
        timeZone: 'UTC',
      },
    };
    const res = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    return res;
  } catch (error) {
    logger.error('Error syncing task to Google Calendar', error);
    throw new Error('error');
  }
};
