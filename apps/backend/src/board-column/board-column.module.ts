import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardColumn } from './board-column.entity';
import { BoardColumnController } from './board-column.controller';
import { BoardColumnService } from './board-column.service';
import { BoardModule } from 'src/board/board.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([BoardColumn]),
        forwardRef(() => BoardModule), 
    ],
    controllers: [BoardColumnController],
    providers: [BoardColumnService],
    exports: [BoardColumnService],
})
export class BoardColumnModule {}
