import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne, 
    JoinColumn, 
    Index 
} from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity('refresh_tokens')
export class RefreshToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // The relational object. TypeORM will automatically create a foreign key.
    @Index()
    @ManyToOne(() => User, { 
        nullable: false, 
        onDelete: 'CASCADE' // If the user is deleted, automatically delete their refresh tokens
    })
    @JoinColumn({ name: 'user_id' })
    user: User;

    // Optional but highly recommended: Exposing the raw foreign key column.
    // This allows you to query/insert using just the string ID without needing to fetch the whole User object.
    @Column({ type: 'uuid', name: 'user_id' })
    userId: string;

    @Column({ 
        type: 'timestamp', // 'timestamptz' is also a great option in Postgres for timezone awareness
        nullable: false 
    })
    expiry: Date;

    @Column({ 
        type: 'boolean', 
        default: true 
    })
    isValid: boolean;
}