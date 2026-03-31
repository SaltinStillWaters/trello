import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ValidationTypes } from './env-validation';

@Injectable()
export class TypedConfigService extends ConfigService<ValidationTypes> {
  get<Key extends keyof ValidationTypes>(key: Key): ValidationTypes[Key] {
    const value = super.get(key);

    if (value === undefined) {
      throw new Error(`Missing env variable: ${String(key)}`);
    }

    return value;
  }
}
