import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    Index, 
    BeforeInsert, 
    BeforeUpdate 
} from 'typeorm';
import { Role } from 'src/auth/types/auth.types';

@Entity('users') // explicitly naming the table 'users'
export class User {
    // TypeORM requires an explicit primary key (Mongoose does this automatically with _id)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column({
        type: 'varchar',
        length: 30,
        unique: true,
        // nullable: false is the default in TypeORM, equivalent to Mongoose's required: true
    })
    name: string;

    @Column({
        type: 'enum',
        enum: Role,
        array: true, // PostgreSQL specific feature that matches Mongoose's [String]
        default: [Role.User] // Highly recommended to set a default role
    })
    roles: Role[];

    @Column({ 
        type: 'varchar',
        name: 'password_hash' // Standard SQL naming convention (snake_case)
    })
    passwordHash: string;

    @Column({
        type: 'boolean',
        default: true,
    })
    isActive: boolean;

    // Mongoose handles `lowercase: true` and `trim: true` at the schema level.
    // In TypeORM, we use lifecycle hooks to mutate the data before saving to the database.
    @BeforeInsert()
    @BeforeUpdate()
    sanitizeData() {
        if (this.name) {
            this.name = this.name.toLowerCase().trim();
        }
    }
}