import { EventType } from '@prisma/client';
import { z } from 'zod';

export const CalendarEventSchema = z.object({
  taskId: z.string(),
  eventDate: z.string().datetime(),
  EventType: z.nativeEnum(EventType),
});

export type CalendarEvent = z.infer<typeof CalendarEventSchema>;
