import prisma from '../../../../core/config/prisma';
import { CalendarEvent } from '../schema/calendarSchema';

export const calendarRepository = {
  createEvent: async (id: number, eventData: CalendarEvent) => {
    return await prisma.calendarEvent.create({
      data: {
        userId: id,
        ...eventData,
      },
    });
  },
  getEvents: async (userId: number) => {
    return await prisma.calendarEvent.findMany({
      where: { userId },
    });
  },
  getEventById: async (userId: number, eventId: number) => {
    return await prisma.calendarEvent.findUnique({
      where: { id: eventId, userId },
    });
  },
  getUser: async (userId: number) => {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  },
};
