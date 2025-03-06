import { Request, Response } from 'express';
import asyncHandler from '../../../../core/utils/asyncHandler';
import logger from '../../../../core/utils/logger';
import * as calendarService from '../services/calendar.services';

export const createCalendarEventController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    if (!userId) {
      logger.error('User not found');
      return res.status(400).json({ message: 'User not found' });
    }
    const eventData = req.body;
    const event = await calendarService.createEventService(userId, eventData);

    res.status(201).json({ data: event });
  }
);

export const getCalendarEventController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    if (!userId) {
      logger.error('User not found');
      return res.status(400).json({ message: 'User not found' });
    }
    const user = await calendarService.getUser(userId);
    if (!user) {
      logger.error('User not found');
      return res.status(400).json({ message: 'User not found' });
    }
    const events = await calendarService.getEventsService(userId);

    res.status(200).json({ data: events });
  }
);

export const getCalendarEventByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    if (!userId) {
      logger.error('User not found');
      return res.status(400).json({ message: 'User not found' });
    }
    const eventId = Number(req.params.eventId);
    const user = await calendarService.getUser(userId);
    if (!user) {
      logger.error('User not found');
      return res.status(400).json({ message: 'User not found' });
    }
    const event = await calendarService.getEventByIdService(userId, eventId);

    res.status(200).json({ data: event });
  }
);

export const updateCalendarEventController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    if (!userId) {
      logger.error('User not found');
      return res.status(400).json({ message: 'User not found' });
    }
    const eventId = Number(req.params.eventId);
    const eventData = req.body;
    const user = await calendarService.getUser(userId);
    if (!user) {
      logger.error('User not found');
      return res.status(400).json({ message: 'User not found' });
    }
    const event = await calendarService.updateEventService(
      userId,
      eventId,
      eventData
    );

    return res.status(200).json({ data: event });
  }
);
export const deleteCalendarEventController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    if (!userId) {
      logger.error('User not found');
      return res.status(400).json({ message: 'User not found' });
    }
    const eventId = Number(req.params.eventId);
    const user = await calendarService.getUser(userId);
    if (!user) {
      logger.error('User not found');
      return res.status(400).json({ message: 'User not found' });
    }
    await calendarService.deleteEventService(userId, eventId);

    res.status(204).json();
  }
);
