import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    ManyToOne, 
    JoinColumn, 
    OneToMany
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { BoardColumn } from 'src/board-column/board-column.entity';

@Entity('boards')
export class Board {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @ManyToOne(() => User, { 
        nullable: false, 
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'owner_id' })
    owner: User;

    @Column({ type: 'uuid', name: 'owner_id' })
    ownerId: string;

    @OneToMany(() => BoardColumn, (column) => column.board)
    columns: BoardColumn[];

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;
}