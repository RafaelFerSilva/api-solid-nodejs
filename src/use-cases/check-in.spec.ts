import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    gymsRepository.items.push({
      id: 'gym-01',
      title: 'teste',
      description: '',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
      phone: '',
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able check-in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'teste',
      description: '',
      latitude: new Decimal(-22.4258668),
      longitude: new Decimal(-46.9552998),
      phone: '',
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -22.4493648,
        userLongitude: -46.9707956,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
