import { Prisma } from "@prisma/client";

export type SkilletWithPrices = Prisma.SkilletGetPayload<{
  include: { tierPrices: { include: { tier: true } } };
}>;