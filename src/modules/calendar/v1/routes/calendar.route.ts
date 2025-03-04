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
  validateSchema(CalendarEventSchema),
  verifyJwt,
  createCalendarEventController
);
router.get('/', verifyJwt, getCalendarEventController);
router.get('/:eventId', verifyJwt, getCalendarEventByIdController);
router.patch('/:eventId', verifyJwt, updateCalendarEventController);
router.delete('/:eventId', verifyJwt, deleteCalendarEventController);
export default router;
