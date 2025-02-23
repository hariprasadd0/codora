import { Router } from 'express';
import {
  createTeamController,
  getTeamController,
  updateTeamController,
  deleteTeamController,
  addTeamMemberController,
  removeTeamMemberController,
  getTeamMembersController,
  inviteController,
} from '../controllers/team.controllers';
import { validateSchema } from '../../../../core/middlewares/validateSchema';
import { TeamCreateSchema } from '../schema/team.schema';
import {
  isTeamLead,
  verifyJwt,
} from '../../../../core/middlewares/auth.middleware';

const router = Router();

// team
router.post(
  '/',
  verifyJwt,
  validateSchema(TeamCreateSchema),
  createTeamController
);
router.get('/:teamId', verifyJwt, getTeamController);
router.patch('/:teamId', verifyJwt, isTeamLead, updateTeamController);
router.delete('/:teamId', verifyJwt, isTeamLead, deleteTeamController);

//team-member
router.post('/:teamId/members', verifyJwt, isTeamLead, addTeamMemberController);
router.get('/:teamId/members', verifyJwt, getTeamMembersController);
router.delete(
  '/:teamId/members/:userId',
  verifyJwt,
  isTeamLead,
  removeTeamMemberController
);
router.get('/invite/:token', inviteController);

export default router;
