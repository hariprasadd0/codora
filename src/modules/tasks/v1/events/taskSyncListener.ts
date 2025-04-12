import { TaskRepository } from '../repositories/task.repository';
import { taskEvent } from './taskEvent';
import { syncTaskToCalendar } from '../../../../core/utils/calendarSync';
async function getGoogleCredentials(id: string) {
  return await TaskRepository.getUser(id);
}

taskEvent.on('TaskAssigned', async (task) => {
  const user = await getGoogleCredentials(task.assignedToId);
  console.log('cred', user);

  if (!user?.googleAccessToken || !user.googleRefreshToken) {
    throw new Error('Google Calendar not isss');
  }
  const result = await syncTaskToCalendar(task.id, {
    accessToken: user.googleAccessToken,
    refreshToken: user.googleRefreshToken,
  });
  console.log('ress', result);
});
