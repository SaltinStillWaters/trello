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

    @Index()
    @ManyToOne(() => User, { 
        nullable: false, 
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'uuid', name: 'user_id' })
    userId: string;

    @Column({ 
        type: 'timestamp',
        nullable: false 
    })
    expiry: Date;

    @Column({ 
        type: 'boolean', 
        default: true 
    })
    isValid: boolean;
}