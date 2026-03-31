import * as zod from 'zod';

// Change this object to match what you require of the .env
// See the official zod documentation for more info
const validationSchema = zod.object({
  TEST_NUMBER: zod.coerce.number(),
  TEST_STRING: zod.string(),

  DB_TYPE: zod.enum(['postgres', 'mysql', 'mariadb', 'mongodb']),
  DB_HOST: zod.string(),
  DB_PORT: zod.coerce.number(),
  DB_USERNAME: zod.string().min(1),
  DB_PASSWORD: zod.string().min(1),
  DB_DATABASE: zod.string().min(1),
  
  // Custom logic for Boolean strings like 'true'
  DB_SYNCHRONIZE: zod.preprocess((val) => val === 'true', zod.boolean()),

  // ~Add your variables here~
});


// Do NOT modify anything past this line!!

export const validationOptions = {
  allowUnkown: false,
  abortEarly: true,
};

export function validate(config: Record<string, unknown>) {
  const result = validationSchema.safeParse(config);

  if (!result.success) {
    throw new Error(`Environment validation error: ${result.error.message}`);
  }

  return result.data;
}

export type ValidationTypes = zod.infer<typeof validationSchema>;