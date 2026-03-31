import { Board } from 'src/board/board.entity';
import { Card } from 'src/card/card.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity('columns')
export class BoardColumn {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    // Critical for drag-and-drop: keeps columns in the right order (0, 1, 2...)
    @Column({ type: 'int', default: 0 })
    order: number;

    // --- Relations ---

    // Many columns belong to one Board
    @ManyToOne(() => Board, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'board_id' })
    board: Board;

    @Column({ type: 'uuid', name: 'board_id' })
    boardId: string;

    // One column has many Cards
    @OneToMany(() => Card, (card) => card.column)
    cards: Card[];
}