import { Test, TestingModule } from '@nestjs/testing';
import { TestExampleController } from './test-example.controller';

describe('TestExampleController', () => {
  let controller: TestExampleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestExampleController],
    }).compile();

    controller = module.get<TestExampleController>(TestExampleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
