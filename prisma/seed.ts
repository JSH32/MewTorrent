import { PrismaClient } from '@prisma/client'
import argon2 from 'argon2'

const prisma = new PrismaClient()

async function seed() {
  await prisma.user.create({
    data: {
      username: "root",
      email: "root@localhost",
      password: await argon2.hash("root"),
      admin: true
    }
  })
}

seed()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e: any) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })