import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as argon from 'argon2';
import { User } from './user/user.entity'; // Adjust this path to your actual entity location
import { Role } from './auth/types/auth.types';

const AppDataSource = new DataSource({
  type: (process.env.DB_TYPE as any) || 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 5435,
  username: process.env.DB_USERNAME || 'admin',
  password: process.env.DB_PASSWORD || 'secretpassword',
  database: process.env.DB_DATABASE || 'trello_pejana',
  entities: [User], // Replaced TestExample with User
  synchronize: true,
});

async function runSeeder() {
  console.log('🌱 Starting database seeder...');

  try {
    await AppDataSource.initialize();

    const userRepository = AppDataSource.getRepository(User);

    // Using .delete({}) instead of .clear() is safer in Postgres 
    // to avoid breaking foreign key constraints (like RefreshTokens)
    await userRepository.createQueryBuilder().delete().execute();
    console.log('🗑️  Cleared existing users.');

    // Hash a universal password for the seeded users so you can log in
    const defaultPasswordHash = await argon.hash('a');

    const users = [
      { 
        name: 'a', 
        roles: [Role.Admin], // Assuming Role.ADMIN exists in your enum
        passwordHash: defaultPasswordHash,
        isActive: true
      },
      { 
        name: 'admin@a.com', 
        roles: [Role.Admin], // Assuming Role.ADMIN exists in your enum
        passwordHash: defaultPasswordHash,
        isActive: true
      },
      { 
        name: 'cashier1@a.com', 
        roles: [Role.User], // Adjust to match your actual Role enum 
        passwordHash: defaultPasswordHash,
        isActive: true
      },
      { 
        name: 'manager@a.com', 
        roles: [Role.User], // Adjust to match your actual Role enum
        passwordHash: defaultPasswordHash,
        isActive: true
      },
    ];

    // Using insert() is highly optimized for bulk creating records
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