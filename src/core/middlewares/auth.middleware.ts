import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { isUserTeamLead } from '../../modules/teams/v1/services/team.service';

export const verifyJwt: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);

    if (!decoded) {
      res.status(401).json({ error: 'Unauthorized: Invalid token' });
      return;
    }
    (req as any).user = decoded;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ error: 'Unauthorized: Token has expired' });
      return;
    }
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ error: 'Unauthorized: Invalid token' });
      return;
    }
  }
};

export const isTeamLead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user; // Extracted from JWT middleware
    const { teamId } = req.params;

    if (!teamId) {
      res.status(400).json({ error: 'Team ID is required' });
    }

    // Check if the user is a team lead
    const isLead = await isUserTeamLead(user.userId, Number(teamId));

    console.log(isLead);

    if (!isLead) {
      res.status(403).json({
        error: 'Access denied. Only Team Leads can perform this action.',
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};
