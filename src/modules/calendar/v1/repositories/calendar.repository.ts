import prisma from '../../../../core/config/prisma';
import { CalendarEvent } from '../schema/calendarSchema';

export const calendarRepository = {
  createEvent: async (id: number, eventData: CalendarEvent) => {
    return await prisma.calendarEvent.create({
      data: {
        userId: id,
        taskId: eventData.taskId,
        eventDate: eventData.eventDate,
        eventType: eventData.EventType,
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
  updateEvent: async (
    userId: number,
    eventId: number,
    eventData: Partial<CalendarEvent>
  ) => {
    return await prisma.calendarEvent.update({
      where: { id: eventId, userId },
      data: eventData,
    });
  },
  deleteEvent: async (userId: number, eventId: number) => {
    return await prisma.calendarEvent.delete({
      where: { id: eventId, userId },
    });
  },
};
