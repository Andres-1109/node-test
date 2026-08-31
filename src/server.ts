import { app } from './app';
import { env } from './config/env';
import { sequelize } from './models';

async function start(): Promise<void> {
  await sequelize.authenticate();
  app.listen(env.port, () => {
    console.log(`RiwiMediCare Plus Supply Request API listening on port ${env.port}`);
  });
}

start().catch((error: unknown) => {
  console.error('Failed to start the server:', error);
  process.exit(1);
});
