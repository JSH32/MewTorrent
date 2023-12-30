import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { User } from '@prisma/client';
import { NextHandler } from 'next-connect';

export interface NextApiRequestWithUser extends NextApiRequest {
  user: User;
}

/**
 * Middleware function that adds authentication to the given handler.
 */
export const withAuth = (admin: boolean) =>
  async (
    req: NextApiRequestWithUser,
    res: NextApiResponse,
    next: NextHandler
  ) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_KEY as string);
      const user = await prisma.user.findUnique({ where: { id: (payload as any).id } });

      if (!user || admin && !user.admin) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized' });
    }
  }
