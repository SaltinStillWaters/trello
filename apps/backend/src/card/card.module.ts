import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './card.entity';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { BoardModule } from 'src/board/board.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Card]),
        forwardRef(() => BoardModule), 
    ],
    providers: [CardService],
    exports: [CardService],
    controllers: [CardController],
})
export class CardModule {}
