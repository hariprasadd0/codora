import * as projectServices from '../services/project.service';
import * as projectRepository from '../repositories/project.repository';

jest.mock('../repositories/project.repository', () => ({
  createProject: jest.fn(),
  getProjectById: jest.fn(),
  listProject: jest.fn(),
  updateProjectById: jest.fn(),
  deleteProject: jest.fn(),
  addMemberToProject: jest.fn(),
  convertToTeam: jest.fn(),
  createTeam: jest.fn(),
}));
describe('projectServices', () => {
  describe('create project', () => {
    const mockProjectData = {
      name: 'Test Project',
      description: 'Test Description',
    };
    beforeEach(() => {
      jest.clearAllMocks();
    });
    test('createProjectService should create a project', async () => {
      (projectRepository.createProject as jest.Mock).mockResolvedValue({
        id: 1,
        ...mockProjectData,
      });
      await projectServices.createProjectService(mockProjectData, 1);
      expect(projectRepository.createProject).toHaveBeenCalledWith(
        mockProjectData,
        1
      );
    });
    test('createProjectService should throw an error if validation fails', async () => {
      await expect(
        projectServices.createProjectService({}, 1)
      ).rejects.toThrow();
    });
  });
  describe('list project', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    test('listProjectService should list projects', async () => {
      (projectRepository.listProject as jest.Mock).mockResolvedValue([
        {
          id: 1,
          name: 'Test Project',
          description: 'Test Description',
        },
      ]);
      await projectServices.listProjectService(1);
      expect(projectRepository.listProject).toHaveBeenCalledWith(1);
    });
  });
  describe('get project by id', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    test('getProjectByIdService should get project by id', async () => {
      (projectRepository.getProjectById as jest.Mock).mockResolvedValue({
        id: 1,
        name: 'Test Project',
        description: 'Test Description',
      });
      await projectServices.getProjectService(1);
      expect(projectRepository.getProjectById).toHaveBeenCalledWith(1);
    });
  });
});
