import { FeatchNearByUseCase } from '../fetch-near-by-gyms'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

export function makeFetchNearbyGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new FeatchNearByUseCase(gymsRepository)

  return useCase
}
