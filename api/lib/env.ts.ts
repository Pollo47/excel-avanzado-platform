import 'dotenv/config';

export const env = {
  databaseUrl: process.env.DATABASE_URL!,
  appSecret: process.env.APP_SECRET!,
  port: parseInt(process.env.PORT || '3000'),
};