import { Controller, Get } from '@nestjs/common';
import { TestExampleService } from './test-example.service';
import type { TestDTO } from '@sudocodes/shared';

@Controller('test-example')
export class TestExampleController {
    constructor(
        private readonly service: TestExampleService
    ) {}

    @Get()
    async test(): Promise<TestDTO> {
        return await this.service.test()
    }
}
