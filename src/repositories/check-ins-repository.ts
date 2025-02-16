import { CheckIn, Prisma } from '@prisma/client'

export interface CheckInsRepostory {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
}
