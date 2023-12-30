import { createRouter } from "next-connect";
import { NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { NextApiRequestWithUser, withAuth } from "../../middleware/withAuth";

const router = createRouter<NextApiRequestWithUser, NextApiResponse>();

router
  .use(withAuth(true))
  .get(async (req, res) => {
    const { id } = req.query

    const code = await prisma.registrationCode.findUnique({
      where: { id: parseInt(id as string) }
    })

    if (!code) {
      return res.status(404).json({ message: 'Invalid registration code!' })
    }

    res.status(200).json(code)
  })
  .delete(async (req, res) => {
    const { id } = req.query

    const { count } = await prisma.registrationCode.deleteMany({
      where: { id: parseInt(id as string) }
    })

    if (!count) {
      return res.status(404).json({ message: 'Invalid registration code!' })
    } else {
      res.status(200).json({ message: 'Registration code deleted!' })
    }
  })

export default router.handler()

export const config = {
  api: {
    externalResolver: true,
  },
};