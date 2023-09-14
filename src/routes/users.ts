import { z } from 'zod'
import { knex } from '../database'
import { FastifyInstance } from 'fastify'
import crypto from 'crypto'

export async function usersRoutes(app: FastifyInstance): Promise<void> {
  app.post('/register', async (request, response) => {
    const createUserBodySchema = z.object({
      name: z.string().min(3).max(255),
      email: z.string().email(),
      password: z.string().min(6).max(255),
    })

    const { name, email, password } = createUserBodySchema.parse(request.body)

    await knex('users').insert({
      id: crypto.randomUUID(),
      name,
      email,
      password,
    })

    return response.status(201).send
  })

  app.post('/login', async (request, response) => {
    const loginBodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6).max(255),
    })

    const { email, password } = loginBodySchema.parse(request.body)

    const user = await knex('users').where({ email }).first()

    if (!user) {
      return response.status(401).send()
    }

    if (password !== user.password) {
      return response.status(401).send()
    }

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = user.id

      response.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
    }

    return response.status(200).send(user)
  })
}
