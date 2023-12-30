import { NextApiResponse } from "next";
import { NextApiRequestWithUser, withAuth } from "../middleware/withAuth";
import { User } from "@prisma/client";
import { createRouter } from "next-connect";

const createUserDto = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    admin: user.admin
  };
}

const router = createRouter<NextApiRequestWithUser, NextApiResponse>();

router
  .use(withAuth(false))
  .get(async (req, res) => res.status(200).json(createUserDto(req.user)))

export default router.handler()

export const config = {
  api: {
    externalResolver: true,
  },
};