import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const validateSchema = (schema: z.ZodSchema) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: error.errors,
        });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};
