import prisma from '@/lib/prisma';
import type { NextApiResponse } from 'next'
import { z } from 'zod';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { createRouter } from 'next-connect';
import { NextApiRequestWithData, validate } from '../middleware/zod';

const LoginSchema = z.object({
  body: z.object({
    auth: z.string(),
    password: z.string(),
  })
});

type Login = z.infer<typeof LoginSchema>;

const router = createRouter<NextApiRequestWithData<Login>, NextApiResponse>();

router
  .use(validate(LoginSchema))
  // Create a new user
  .post(async (req, res) => {
    // make query for email OR username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: req.parsed.body.auth },
          { username: req.parsed.body.auth }]
      }
    })

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const valid = await argon2.verify(user.password, req.parsed.body.password)
      .then(valid => valid ? true : null)
      .catch(() => false)

    if (!valid) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    res.status(200).json({
      token: jwt.sign({ id: user.id }, process.env.JWT_KEY as string)
    })
  })

export default router.handler()

export const config = {
  api: {
    externalResolver: true,
  },
};