import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    ManyToOne, 
    JoinColumn 
} from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity('boards')
export class Board {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    // --- Relations ---

    // Every board must have an owner/creator
    @ManyToOne(() => User, { 
        nullable: false, 
        onDelete: 'CASCADE' // If the user is deleted, delete their boards too
    })
    @JoinColumn({ name: 'owner_id' })
    owner: User;

    // Exposing the raw foreign key for easier queries (just like we did with RefreshToken)
    @Column({ type: 'uuid', name: 'owner_id' })
    ownerId: string;

    // --- Timestamps ---

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;
}