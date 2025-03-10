import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms.repository'

interface FetchchNearByUseCaseRequest {
  userLatitude: number
  userLongitude: number
}

interface FetchchNearByUseCaseResponse {
  gyms: Gym[]
}

export class FeatchNearByUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FetchchNearByUseCaseRequest): Promise<FetchchNearByUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyBearBy({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return {
      gyms,
    }
  }
}
