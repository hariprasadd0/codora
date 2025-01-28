import app from './app';
import prisma from './core/config/prisma';
import logger from './core/utils/logger';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await prisma.$connect();
    app.listen(PORT, () => {
      logger.info(`app running on port ${PORT}`);
    });
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
process.on('SIGUSR2', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
startServer();
