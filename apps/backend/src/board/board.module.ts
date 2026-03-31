import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { BoardColumnModule } from 'src/board-column/board-column.module';
import { CardModule } from 'src/card/card.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Board]),
        forwardRef(() => BoardColumnModule), 
        forwardRef(() => CardModule), 
    ],
    providers: [BoardService],
    exports: [BoardService],
    controllers: [BoardController],
})
export class BoardModule {}
