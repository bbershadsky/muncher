import { MongoClient } from 'mongodb';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_NAME = 'youtube';
const COLLECTION_NAME = 'users';

const setup = async () => {
  let client;

  try {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const hasData = await collection.countDocuments();

    if (hasData) {
      console.log('Database already contains data.');
      return;
    }

    const records = [...Array(10)].map(() => ({
      name: faker.name.findName(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      image: faker.image.people(640, 480, true),
      followers: faker.datatype.number({ min: 0, max: 1000 }),
      emailVerified: faker.datatype.boolean() ? new Date() : null
    }));

    const insert = await collection.insertMany(records);

    if (insert.acknowledged) {
      console.log('Successfully inserted records:', insert.insertedCount);
    }
    return null;
  } catch (error) {
    console.error('Failed to set up database:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
};

setup().catch((error) => {
  console.error('Setup failed:', error);
});

export { setup };
