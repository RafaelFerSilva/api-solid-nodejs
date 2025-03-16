import { prisma } from '@/lib/prisma'
import { makeUserData } from '@/use-cases/factories/make-user-data-test'
import { FastifyInstance } from 'fastify'
import { hash } from 'bcryptjs'
import request from 'supertest'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
) {
  const role = isAdmin ? 'ADMIN' : 'MEMBER'

  const newUser = makeUserData({
    role,
  })
  const userResponse = await prisma.user.create({
    data: {
      name: newUser.name,
      email: newUser.email,
      password_hash: await hash(newUser.password, 6),
      role,
    },
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: newUser.email,
    password: newUser.password,
  })

  const { token } = authResponse.body

  return {
    token,
    user: userResponse,
  }
}
