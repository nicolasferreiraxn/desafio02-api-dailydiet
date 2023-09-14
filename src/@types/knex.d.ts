// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
      password: string
      created_at: Date
    }
    meals: {
      id: string
      name: string
      description: string
      diet: boolean
      user_id: string
      meal_at: Date
      created_at: Date
    }
  }
}
