import { CheckIn, Prisma } from '@prisma/client'

export interface CheckInsRepostory {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
}
