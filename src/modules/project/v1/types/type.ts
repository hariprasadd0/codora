export type Project = {
  id: number;
  name: string;
  description: string;
  teamId: number;
  createdById?: number;
  deadline: Date;
};
