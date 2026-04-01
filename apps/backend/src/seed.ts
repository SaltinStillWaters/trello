import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as argon from 'argon2';
import { User } from './user/user.entity';
import { Role } from './auth/types/auth.types';

const AppDataSource = new DataSource({
  type: (process.env.DB_TYPE as any) || 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 5435,
  username: process.env.DB_USERNAME || 'admin',
  password: process.env.DB_PASSWORD || 'secretpassword',
  database: process.env.DB_DATABASE || 'trello_pejana',
  entities: [User],
  synchronize: true,
});

async function runSeeder() {
  console.log('🌱 Starting database seeder...');

  try {
    await AppDataSource.initialize();

    const userRepository = AppDataSource.getRepository(User);

    await userRepository.createQueryBuilder().delete().execute();
    console.log('🗑️  Cleared existing users.');

    const defaultPasswordHash = await argon.hash('a');

    const users = [
      { 
        name: 'John', 
        roles: [Role.Admin],
        passwordHash: defaultPasswordHash,
        isActive: true
      },
      { 
        name: 'Luna', 
        roles: [Role.Admin],
        passwordHash: defaultPasswordHash,
        isActive: true
      },
      { 
        name: 'cashier1@a.com', 
        roles: [Role.User],
        passwordHash: defaultPasswordHash,
        isActive: true
      },
      { 
        name: 'manager@a.com', 
        roles: [Role.User],
        passwordHash: defaultPasswordHash,
        isActive: true
      },
    ];

    await userRepository.insert(users);
    console.log(`✅ Successfully seeded ${users.length} users! (Password: password123)`);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await AppDataSource.destroy();
    console.log('🔌 Disconnected from database.');
  }
}

runSeeder();