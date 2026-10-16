import 'dotenv/config';

export const BASE_URL = process.env.BASE_URL || 'https://create-asana-like-pr-39y5.bolt.host/';

export const credentials = {
  username: process.env.APP_USERNAME || 'admin',
  password: process.env.APP_PASSWORD || 'password123',
};
