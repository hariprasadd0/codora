import { Router } from 'express';
import {
  createTeamController,
  getTeamController,
  updateTeamController,
  deleteTeamController,
  addTeamMemberController,
  removeTeamMemberController,
  getTeamMembersController,
} from '../controllers/team.controllers';
import { validateSchema } from '../../../../core/middlewares/validateSchema';
import { TeamCreateSchema } from '../schema/team.schema';
import { verifyJwt } from '../../../../core/middlewares/auth.middleware';

const router = Router();

// team
router.post(
  '/',
  verifyJwt,
  validateSchema(TeamCreateSchema),
  createTeamController
);
router.get('/:teamId', getTeamController);
router.patch('/:teamId', updateTeamController);
router.delete('/:teamId', deleteTeamController);

//team-member
router.post('/:teamId/members', addTeamMemberController);
router.get('/:teamId/members', getTeamMembersController);
router.delete('/:teamId/members/:userId', removeTeamMemberController);

export default router;
