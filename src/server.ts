import app from './app';
import prisma from './core/config/prisma';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await prisma.$connect();
    app.listen(PORT, () => {
      console.log(`app running on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
