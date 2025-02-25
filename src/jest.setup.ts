//jest.setup.ts inside src
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
  // Ensure the database is clean before running tests
  await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Team" CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Project" CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Task" CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Payment" CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "CalendarEvent" CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Invitation" CASCADE;`;
});

afterAll(async () => {
  await prisma.$disconnect();
});

export default prisma;
