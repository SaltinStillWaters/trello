import { BoardColumn } from 'src/board-column/board-column.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('cards')
export class Card {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    // Critical for drag-and-drop: keeps cards in order within their specific column
    @Column({ type: 'int', default: 0 })
    order: number;

    // --- Relations ---

    // Many cards belong to one Column
    @ManyToOne(() => BoardColumn, (column) => column.cards, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'column_id' })
    column: BoardColumn;

    @Column({ type: 'uuid', name: 'column_id' })
    columnId: string;

    // --- Timestamps ---

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}