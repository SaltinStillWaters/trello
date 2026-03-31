import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    Index, 
    BeforeInsert, 
    BeforeUpdate 
} from 'typeorm';
import { Role } from 'src/auth/types/auth.types';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column({
        type: 'varchar',
        length: 30,
        unique: true,
    })
    name: string;

    @Column({
        type: 'enum',
        enum: Role,
        array: true,
        default: [Role.User]
    })
    roles: Role[];

    @Column({ 
        type: 'varchar',
        name: 'password_hash'
    })
    passwordHash: string;

    @Column({
        type: 'boolean',
        default: true,
    })
    isActive: boolean;

    @BeforeInsert()
    @BeforeUpdate()
    sanitizeData() {
        if (this.name) {
            this.name = this.name.toLowerCase().trim();
        }
    }
}