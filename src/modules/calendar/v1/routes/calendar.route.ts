import { Router } from 'express';
import { verifyJwt } from '../../../../core/middlewares/auth.middleware';
import {
  createCalendarEventController,
  getCalendarEventByIdController,
  getCalendarEventController,
  updateCalendarEventController,
  deleteCalendarEventController,
} from '../controllers/calendar.controller';
import { validateSchema } from '../../../../core/middlewares/validateSchema';
import { CalendarEventSchema } from '../schema/calendarSchema';
const router = Router();

router.post(
  '/events',
  verifyJwt,
  validateSchema(CalendarEventSchema),
  createCalendarEventController
);
router.get('/events', verifyJwt, getCalendarEventController);
router.patch('/events/:eventId', verifyJwt, updateCalendarEventController);
router.get('/:eventId', verifyJwt, getCalendarEventByIdController);
router.delete('/:eventId', verifyJwt, deleteCalendarEventController);
export default router;
