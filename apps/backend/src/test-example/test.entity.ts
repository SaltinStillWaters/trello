import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('test_example')
export class TestExample {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({ unique: true })
  email: string;

  @Column({ default: 'CASHIER' })
  role: string;

  @CreateDateColumn() // Automatically sets the date when inserted
  createdAt: Date;
}
