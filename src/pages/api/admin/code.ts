import { createRouter } from "next-connect";
import { NextApiRequestWithData, validate } from "../middleware/zod";
import { z } from 'zod';
import { NextApiResponse } from "next";
import { NextApiRequestWithUser, withAuth } from "../middleware/withAuth";
import prisma from "@/lib/prisma";

const RegistrationSchema = z.object({
  query: z.object({
    uses: z.number().int().default(0),
  }),
})

type Registration = z.infer<typeof RegistrationSchema>;

const router = createRouter<
  NextApiRequestWithData<Registration> & NextApiRequestWithUser,
  NextApiResponse
>();

router
  .use(withAuth(true))
  .use(validate(RegistrationSchema))
  .post(async (req, res) => {
    const code = await prisma.registrationCode.create({
      data: {
        code: crypto.randomUUID(),
        uses: req.parsed.query.uses
      }
    })

    return res.status(200).json(code)
  })

export default router.handler()

export const config = {
  api: {
    externalResolver: true,
  },
};