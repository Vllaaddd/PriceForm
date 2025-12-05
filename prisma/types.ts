import { Prisma } from "@prisma/client";

export type SkilletWithPrices = Prisma.SkilletGetPayload<{
  include: { tierPrices: { include: { tier: true } } };
}>;

export type UmkartonWithPrices = Prisma.UmkartonGetPayload<{
  include: { tierPrices: { include: { tier: true } } };
}>;