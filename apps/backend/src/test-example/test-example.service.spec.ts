import { Test, TestingModule } from '@nestjs/testing';
import { TestExampleService } from './test-example.service';

describe('TestExampleService', () => {
  let service: TestExampleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestExampleService],
    }).compile();

    service = module.get<TestExampleService>(TestExampleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
