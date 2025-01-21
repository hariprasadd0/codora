import {
  PrismaClient,
  Preference,
  Role,
  Status,
  Priority,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.$transaction([
    prisma.calendarEvent.deleteMany(),
    prisma.payment.deleteMany(),
    prisma.task.deleteMany(),
    prisma.project.deleteMany(),
    prisma.teamMember.deleteMany(),
    prisma.team.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  // Create users
  const password = await bcrypt.hash('password123', 10);

  const john = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      passwordHash: password,
      preference: Preference.MORNING,
    },
  });

  const jane = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      passwordHash: password,
      preference: Preference.AFTERNOON,
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: 'Bob Wilson',
      email: 'bob@example.com',
      passwordHash: password,
      preference: Preference.NIGHT,
    },
  });

  // Create teams
  const devTeam = await prisma.team.create({
    data: {
      name: 'Development Team',
      description: 'Main development team',
      createdById: john.id,
    },
  });

  const designTeam = await prisma.team.create({
    data: {
      name: 'Design Team',
      description: 'UI/UX design team',
      createdById: jane.id,
    },
  });

  // Add team members
  await prisma.teamMember.createMany({
    data: [
      {
        teamId: devTeam.id,
        userId: john.id,
        role: Role.TEAM_LEAD,
      },
      {
        teamId: devTeam.id,
        userId: bob.id,
        role: Role.MEMBER,
      },
      {
        teamId: designTeam.id,
        userId: jane.id,
        role: Role.TEAM_LEAD,
      },
      {
        teamId: designTeam.id,
        userId: john.id,
        role: Role.MEMBER,
      },
    ],
  });

  // Create projects
  const website = await prisma.project.create({
    data: {
      name: 'Company Website',
      description: 'Redesign of the company website',
      teamId: devTeam.id,
      createdById: john.id,
      deadline: new Date('2025-06-01'),
    },
  });

  const mobileApp = await prisma.project.create({
    data: {
      name: 'Mobile App',
      description: 'New mobile application development',
      teamId: designTeam.id,
      createdById: jane.id,
      deadline: new Date('2025-07-01'),
    },
  });

  // Create tasks
  const task1 = await prisma.task.create({
    data: {
      name: 'Setup Project Structure',
      description: 'Initialize the project and set up basic architecture',
      status: Status.COMPLETED,
      assignedToId: john.id,
      projectId: website.id,
      priority: Priority.HIGH,
      deadline: new Date('2025-02-15'),
    },
  });

  const task2 = await prisma.task.create({
    data: {
      name: 'Design Homepage',
      description: 'Create homepage mockups',
      status: Status.IN_PROGRESS,
      assignedToId: jane.id,
      projectId: website.id,
      priority: Priority.MEDIUM,
      deadline: new Date('2025-03-01'),
      dependencyTaskId: task1.id,
    },
  });

  // Create calendar events
  await prisma.calendarEvent.createMany({
    data: [
      {
        userId: john.id,
        taskId: task1.id,
        eventDate: new Date('2025-02-10T10:00:00Z'),
      },
      {
        userId: jane.id,
        taskId: task2.id,
        eventDate: new Date('2025-02-20T14:00:00Z'),
      },
    ],
  });

  // Create payments
  await prisma.payment.createMany({
    data: [
      {
        teamId: devTeam.id,
        amount: 1000.0,
        paidById: john.id,
        description: 'Development tools subscription',
      },
      {
        teamId: designTeam.id,
        amount: 750.0,
        paidById: jane.id,
        description: 'Design software licenses',
      },
    ],
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
