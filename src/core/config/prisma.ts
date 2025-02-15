import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

const prisma = new PrismaClient({
  log: ['query'],
  errorFormat: 'minimal',
});

process.on('SIGINT', async () => {
  try {
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
});

export default prisma;
