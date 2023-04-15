import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config();

const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_PROJECT_DATASET,
  apiVersion: '2021-10-21',
  useCdn: false,
});

export default sanity;
