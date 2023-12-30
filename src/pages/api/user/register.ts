import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod';
import argon2 from 'argon2';
import { createRouter, expressWrapper } from 'next-connect';
import { NextApiRequestWithData, validate } from '../middleware/zod';

const RegisterSchema = z.object({
  body: z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(5).max(32),
    registrationCode: z.string()
  })
});

type Register = z.infer<typeof RegisterSchema>

const router = createRouter<NextApiRequestWithData<Register>, NextApiResponse>();

router
  .use(validate(RegisterSchema))
  // Create a new user
  .post(async (req, res) => {
    // make query for email OR username
    const found = await prisma.user.findFirst({
      where: {
        OR: [
          { email: req.parsed.body.email },
          { username: req.parsed.body.username }]
      }
    })

    if (found) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const code = await prisma.registrationCode.findFirst({
      where: {
        code: req.parsed.body.registrationCode
      }
    })

    if (!code) {
      return res.status(400).json({
        message: 'Invalid registration code',
        errors: { registrationCode: 'Invalid registration code' }
      })
    } else {
      // Decrement uses or delete if 1, if 0 assume infinite.
      if (code.uses > 1) {
        await prisma.registrationCode.update({
          where: { id: code.id },
          data: { uses: code.uses - 1 }
        })
      } else if (code.uses !== 0) {
        await prisma.registrationCode.delete({ where: { id: code.id } })
      }
    }

    const user = await prisma.user.create({
      data: {
        username: req.parsed.body.username,
        email: req.parsed.body.email,
        password: await argon2.hash(req.parsed.body.password)
      }
    })

    res.status(200).json(user)
  })

export default router.handler()

export const config = {
  api: {
    externalResolver: true,
  },
};