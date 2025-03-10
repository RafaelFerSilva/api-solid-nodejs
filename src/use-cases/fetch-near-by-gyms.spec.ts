import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { FeatchNearByUseCase } from './fetch-near-by-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FeatchNearByUseCase

describe('Fetch near by Gym Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FeatchNearByUseCase(gymsRepository)
  })

  it('should be able to fetch near by gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: -22.4258668,
      longitude: -46.9552998,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: -23.1895193,
      longitude: -46.9891017,
    })

    const { gyms } = await sut.execute({
      userLatitude: -22.4258668,
      userLongitude: -46.9552998,
    })
    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
