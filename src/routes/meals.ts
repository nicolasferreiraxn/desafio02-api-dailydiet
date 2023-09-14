import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { checkSessionIdExists } from '../middlawares/check-session-id-exists'
import { knex } from '../database'
import crypto from 'crypto'

export async function mealsRoutes(app: FastifyInstance): Promise<void> {
  app.addHook('preHandler', checkSessionIdExists)

  app.post('/', async (request, response) => {
    const mealBodySchema = z.object({
      name: z.string().min(3).max(255),
      description: z.string().min(3).max(255),
      diet: z.boolean(),
      mealAt: z.coerce.date(),
    })

    const { name, description, diet, mealAt } = mealBodySchema.parse(
      request.body,
    )

    const { sessionId } = request.cookies

    await knex('meals').insert({
      id: crypto.randomUUID(),
      name,
      description,
      diet,
      user_id: sessionId,
      meal_at: mealAt,
    })

    return response.status(201).send()
  })

  app.get('/', async (request, response) => {
    const { sessionId } = request.cookies

    const meals = await knex('meals').where({ user_id: sessionId })

    return response.status(200).send({
      meals,
    })
  })

  app.get('/:id', async (request, response) => {
    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealParamsSchema.parse(request.params)

    const { sessionId } = request.cookies

    const meal = await knex('meals').where({ id, user_id: sessionId }).first()

    if (!meal) {
      return response.status(404).send()
    }

    return response.status(200).send({
      meal,
    })
  })

  app.delete('/:id', async (request, response) => {
    const deleteMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = deleteMealParamsSchema.parse(request.params)

    const { sessionId } = request.cookies

    const meal = await knex('meals').where({ id, user_id: sessionId }).first()

    if (!meal) {
      return response.status(404).send()
    }

    await knex('meals').where({ id }).del()

    return response.status(204).send()
  })

  app.put('/:id', async (request, response) => {
    const updateMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = updateMealParamsSchema.parse(request.params)

    const updateMealBodySchema = z.object({
      name: z.string().min(3).max(255),
      description: z.string().min(3).max(255),
      diet: z.boolean(),
      mealAt: z.coerce.date(),
    })

    const { name, description, diet, mealAt } = updateMealBodySchema.parse(
      request.body,
    )

    const { sessionId } = request.cookies

    const meal = await knex('meals').where({ id, user_id: sessionId }).first()

    if (!meal) {
      return response.status(404).send()
    }

    await knex('meals').where({ id }).update({
      name,
      description,
      diet,
      meal_at: mealAt,
    })

    return response.status(204).send()
  })

  app.get('/metrics', async (request, response) => {
    const { sessionId } = request.cookies

    const meals = await knex('meals').where({ user_id: sessionId })

    // const metrics = meals.reduce((meal () => {
    //  if (meal.diet) {
    //    meal.totalMealsInDiet += 1
    //  }
    //
    // }), {
    //  totalMealsInDiet: 0,
    //  totalMealsNotInDiet: 0,
    //  totalMeals: 0,
    //  totalSequenceInDiet: 0,
    // })

    const { totalMealsInDiet, totalMealsNotInDiet } = meals.reduce(
      (acc, meal) => {
        if (meal.diet) {
          acc.totalMealsInDiet += 1
        } else {
          acc.totalMealsNotInDiet += 1
        }

        return acc
      },
      {
        totalMealsInDiet: 0,
        totalMealsNotInDiet: 0,
      },
    )

    // eu tenho 100 % dentro da dieta e quero saber quantos % eu tenho fora da dieta
    const { bestSequenceInDiet, totalSequenceInDiet } = meals.reduce(
      (acc, meal) => {
        if (meal.diet) {
          acc.totalSequenceInDiet += 1
        } else {
          acc.totalSequenceInDiet = 0
        }

        if (acc.totalSequenceInDiet > acc.bestSequenceInDiet) {
          acc.bestSequenceInDiet = acc.totalSequenceInDiet
        }

        return acc
      },
      {
        bestSequenceInDiet: 0,
        totalSequenceInDiet: 0,
      },
    )

    return response.status(200).send({
      metrics: {
        totalMeals: meals.length,
        totalMealsInDiet,
        totalMealsNotInDiet,
        bestSequenceInDiet,
        totalSequenceInDiet,
      },
    })
  })
}
