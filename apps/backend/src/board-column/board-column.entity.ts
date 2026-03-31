import { Board } from 'src/board/board.entity';
import { Card } from 'src/card/card.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity('columns')
export class BoardColumn {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'int', default: 0 })
    order: number;

    @ManyToOne(() => Board, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'board_id' })
    board: Board;

    @Column({ type: 'uuid', name: 'board_id' })
    boardId: string;

    @OneToMany(() => Card, (card) => card.column)
    cards: Card[];
}