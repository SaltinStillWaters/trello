import { Module } from '@nestjs/common';
import { TestExampleController } from './test-example.controller';
import { TestExampleService } from './test-example.service';
import { TestExample } from './test.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    // You need to register your entity here to connect it to the DB
    TypeOrmModule.forFeature([TestExample])
  ],
  controllers: [TestExampleController],
  providers: [TestExampleService]
})
export class TestExampleModule {}
