import { ApiError } from '../../../../core/utils/ApiError';
import { calendarRepository } from '../repositories/calendar.repository';
import { CalendarEventSchema } from '../schema/calendarSchema';
import logger from '../../../../core/utils/logger';

export const createEventService = async (
  userId: number,
  eventData: unknown
) => {
  const event = CalendarEventSchema.parse(eventData);
  const user = await calendarRepository.getUser(userId);
  if (!user) {
    throw new ApiError(400, 'User not found');
  }
  const newEvent = await calendarRepository.createEvent(user.id, event);
  logger.info('Event created successfully', event);

  return newEvent;
};

export const getEventsService = async (userId: number) => {
  return await calendarRepository.getEvents(userId);
};
export const getEventByIdService = async (userId: number, eventId: number) => {
  return await calendarRepository.getEventById(userId, eventId);
};
export const getUser = async (userId: number) => {
  return await calendarRepository.getUser(userId);
};
