import { createRouter } from "next-connect";
import { NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { NextApiRequestWithUser, withAuth } from "@/pages/api/middleware/withAuth";
import { NextApiRequestWithData, validate } from "../../middleware/zod";
import { List, ListSchema } from "../../paginate";

const router = createRouter<
  NextApiRequestWithData<List> & NextApiRequestWithUser,
  NextApiResponse
>();

router
  .use(withAuth(true))
  .use(validate(ListSchema))
  .get(async (req, res) => {
    const page = parseInt(req.query.page as string)

    if (page! < 1) {
      return res.status(400).json({ message: 'Invalid page!' })
    }

    const results = await prisma.registrationCode.findMany({
      skip: (page - 1) * 10,
      take: 10,
    })

    const count = await prisma.registrationCode.count()

    res.status(200).json({
      items: results,
      page: page,
      totalPages: Math.ceil(count / 10),
    })
  })

export default router.handler()

export const config = {
  api: {
    externalResolver: true,
  },
};