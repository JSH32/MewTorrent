import prisma from "@/lib/prisma";
import { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";

export interface Page<T> {
  page: number;
  totalPages: number;
  items: T[];
}

export const ListSchema = z.object({
  query: z.object({
    page: z.coerce.number().positive(),
  }),
})

export type List = z.infer<typeof ListSchema>;