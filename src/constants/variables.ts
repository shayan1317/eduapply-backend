import dotenv from 'dotenv';

dotenv.config();
export const serviceAccountKey = process.env.GOOGLE_APPLICATION_CREDENTIALS;
