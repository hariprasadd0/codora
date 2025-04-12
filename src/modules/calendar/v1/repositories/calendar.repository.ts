import prisma from '../../../../core/config/prisma';
import { CalendarEvent } from '../schema/calendarSchema';

export const calendarRepository = {
  createEvent: async (id: string, eventData: CalendarEvent) => {
    return await prisma.calendarEvent.create({
      data: {
        userId: id,
        taskId: eventData.taskId,
        eventDate: eventData.eventDate,
        eventType: eventData.EventType,
      },
    });
  },
  getEvents: async (userId: string) => {
    return await prisma.calendarEvent.findMany({
      where: { userId },
    });
  },
  getEventById: async (userId: string, eventId: string) => {
    return await prisma.calendarEvent.findUnique({
      where: { id: eventId, userId },
    });
  },
  getUser: async (userId: string) => {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  },
  updateEvent: async (
    userId: string,
    eventId: string,
    eventData: Partial<CalendarEvent>
  ) => {
    return await prisma.calendarEvent.update({
      where: { id: eventId, userId },
      data: eventData,
    });
  },
  deleteEvent: async (userId: string, eventId: string) => {
    return await prisma.calendarEvent.delete({
      where: { id: eventId, userId },
    });
  },
};
