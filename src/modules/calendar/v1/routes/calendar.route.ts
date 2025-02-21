import { Router } from 'express';
import { verifyJwt } from '../../../../core/middlewares/auth.middleware';
import { createCalendarEventController } from '../controllers/calendar.controller';
import { validateSchema } from '../../../../core/middlewares/validateSchema';
import { CalendarEventSchema } from '../schema/calendarSchema';
const router = Router();

router.post(
  '/events',
  validateSchema(CalendarEventSchema),
  verifyJwt,
  createCalendarEventController
);

export default router;
