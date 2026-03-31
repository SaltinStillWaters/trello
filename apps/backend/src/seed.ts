import 'dotenv/config';
import { DataSource } from 'typeorm';
import { TestExample } from './test-example/test.entity';

const AppDataSource = new DataSource({
  type: (process.env.DB_TYPE as any) || 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 5435,
  username: process.env.DB_USERNAME || 'admin',
  password: process.env.DB_PASSWORD || 'secretpassword',
  database: process.env.DB_DATABASE || 'trello_pejana',
  entities: [TestExample],
  synchronize: true,
});

async function runSeeder() {
  console.log('🌱 Starting database seeder...');

  try {
    await AppDataSource.initialize();

    const userRepository = AppDataSource.getRepository(TestExample);

    await userRepository.clear();
    console.log('🗑️  Cleared existing users.');

    const users = [
      { email: 'admin@sudocodes.com', role: 'ADMIN' },
      { email: 'cashier1@sudocodes.com', role: 'CASHIER' },
      { email: 'manager@sudocodes.com', role: 'MANAGER' },
    ];

    await userRepository.save(users);
    console.log(`✅ Successfully seeded ${users.length} users!`);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await AppDataSource.destroy();
    console.log('🔌 Disconnected from database.');
  }
}

runSeeder();
