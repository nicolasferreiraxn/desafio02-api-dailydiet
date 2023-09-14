import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
  beforeEach,
  afterEach,
} from 'vitest'
import { app } from '../src/app'
import request from 'supertest'
import { execSync } from 'node:child_process'

describe('Diet App', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:latest')
  })

  afterEach(() => {
    execSync('npm run knex migrate:rollback --all')
  })

  it('should create a user', async () => {
    await request(app.server).post('/users/register').send({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123456',
    })
  })

  it('should login a user', async () => {
    await request(app.server).post('/users/register').send({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123456',
    })

    const loginUserResponse = await request(app.server)
      .post('/users/login')
      .send({
        email: 'johndoe@mail.com',
        password: '123456',
      })
      .expect(200)

    expect(loginUserResponse.body).toEqual(
      expect.objectContaining({
        name: 'John Doe',
        email: 'johndoe@mail.com',
      }),
    )
  })

  it('should create a meal', async () => {
    await request(app.server).post('/users/register').send({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123456',
    })

    const loginUserResponse = await request(app.server)
      .post('/users/login')
      .send({
        email: 'johndoe@mail.com',
        password: '123456',
      })

    const cookies = loginUserResponse.get('Set-cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'File mignon',
        description: 'Hamburguer do podrao da esquina',
        diet: false,
        mealAt: new Date(),
      })
      .expect(201)
  })

  it('should list all meals', async () => {
    await request(app.server).post('/users/register').send({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123456',
    })

    const loginUserResponse = await request(app.server)
      .post('/users/login')
      .send({
        email: 'johndoe@mail.com',
        password: '123456',
      })

    const cookies = loginUserResponse.get('Set-cookie')

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'File mignon',
      description: 'Hamburguer do podrao da esquina',
      diet: false,
      mealAt: new Date(),
    })

    const mealsGetResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    expect(mealsGetResponse.body.meals).toEqual([
      expect.objectContaining({
        name: 'File mignon',
        description: 'Hamburguer do podrao da esquina',
        diet: 0,
      }),
    ])
  })

  it('should detail a meal', async () => {
    await request(app.server).post('/users/register').send({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123456',
    })

    const loginUserResponse = await request(app.server)
      .post('/users/login')
      .send({
        email: 'johndoe@mail.com',
        password: '123456',
      })

    const cookies = loginUserResponse.get('Set-cookie')

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'File mignon',
      description: 'Hamburguer do podrao da esquina',
      diet: false,
      mealAt: new Date(),
    })

    const mealsGetResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = mealsGetResponse.body.meals[0].id

    await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(200)
  })

  it('should delete a meal', async () => {
    await request(app.server).post('/users/register').send({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123456',
    })

    const loginUserResponse = await request(app.server)
      .post('/users/login')
      .send({
        email: 'johndoe@mail.com',
        password: '123456',
      })

    const cookies = loginUserResponse.get('Set-cookie')

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'File mignon',
      description: 'Hamburguer do podrao da esquina',
      diet: false,
      mealAt: new Date(),
    })

    const mealsGetResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = mealsGetResponse.body.meals[0].id

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(204)
  })

  it('should update a meal', async () => {
    await request(app.server).post('/users/register').send({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123456',
    })

    const loginUserResponse = await request(app.server)
      .post('/users/login')
      .send({
        email: 'johndoe@mail.com',
        password: '123456',
      })

    const cookies = loginUserResponse.get('Set-cookie')

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'File mignon',
      description: 'Hamburguer do podrao da esquina',
      diet: false,
      mealAt: new Date(),
    })

    const mealsGetResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = mealsGetResponse.body.meals[0].id

    await request(app.server)
      .put(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .send({
        name: 'File mignon com bacon',
        description: 'Xis tudo de esquina',
        diet: true,
        mealAt: new Date(),
      })
      .expect(204)
  })
})
