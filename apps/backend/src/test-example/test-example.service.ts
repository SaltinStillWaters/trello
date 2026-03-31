import { Injectable } from '@nestjs/common';
import { TestDTO } from '@sudocodes/shared';
import { TypedConfigService } from 'src/typed-config/typed-config.service';
import { TestExample } from './test.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TestExampleService {
    constructor(
        private configService: TypedConfigService,
        @InjectRepository(TestExample)
        private repository: Repository<TestExample>,
    ) {}

    async test(): Promise<TestDTO> {
        const db = await this.repository.find();

        return {
            id: 'THIS IS FROM THE API: test()!!',
            value: 500,
            envString: this.configService.get('TEST_STRING'),
            envNumber: this.configService.get('TEST_NUMBER'),
            db
        };
    }
}
