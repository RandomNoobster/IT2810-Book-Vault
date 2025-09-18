import * as dotenv from 'dotenv';
dotenv.config();

import { MongoClient } from 'mongodb';

const connectionString = process.env.ATLAS_URI || '';
const client = new MongoClient(connectionString);

let connection: MongoClient;
try {
  connection = await client.connect();
} catch (e) {
  console.error(e);
  console.log(`\n\nYou must set the ATLAS_URI environment variable in the .env file`);
}

const db = connection.db('bookvault');

export default db;
