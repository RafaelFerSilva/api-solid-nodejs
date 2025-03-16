import { PrismaClient } from '@prisma/client'
import 'dotenv/config'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import type { Environment } from 'vitest/environments'

const prisma = new PrismaClient()

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined')
  }

  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schema)
  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',

  async setup() {
    const schema = `test_${randomUUID().replace(/-/g, '')}`
    const databaseURL = generateDatabaseURL(schema)

    // Garante que o schema não existe antes de criar
    try {
      await prisma.$executeRawUnsafe(
        `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
      )
    } catch (error) {
      console.log('Error dropping schema:', error)
    }

    process.env.DATABASE_URL = databaseURL

    // Aguarda para garantir que o schema foi removido
    await new Promise((resolve) => setTimeout(resolve, 500))

    try {
      execSync('npx prisma migrate deploy', {
        env: {
          ...process.env,
          DATABASE_URL: databaseURL,
        },
      })
    } catch (error) {
      console.error('Error running migrations:', error)
      throw error
    }

    return {
      async teardown() {
        try {
          await prisma.$executeRawUnsafe(
            `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
          )
        } catch (error) {
          console.log('Error dropping schema on teardown:', error)
        }
        await prisma.$disconnect()
      },
    }
  },
}
