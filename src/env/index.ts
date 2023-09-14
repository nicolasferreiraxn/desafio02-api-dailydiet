import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']).default('sqlite'),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  throw new Error('Invalid environment variables')
}

export const env = _env.data
