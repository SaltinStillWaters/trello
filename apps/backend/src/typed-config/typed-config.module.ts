import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate, validationOptions } from 'src/typed-config/env-validation';
import { TypedConfigService } from './typed-config.service';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            validate: validate,
            validationOptions: validationOptions,
        })
    ],
    providers: [TypedConfigService],
    exports: [TypedConfigService],
})
export class TypedConfigModule {}
