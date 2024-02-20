import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { CheckInsUseCase } from '../check-ins';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { MaxNumberOfCheckInsError } from '../errors/max-number-of-check-ins-error';
import { MaxDistanceError } from '../errors/max-distance-error';

let inMemory: InMemoryCheckInsRepository;
let inMemoryGyms: InMemoryGymsRepository;
let sut: CheckInsUseCase;


describe('Check-in Use Case', () => {

  beforeEach( async () => {
    inMemory = new InMemoryCheckInsRepository();
    inMemoryGyms = new InMemoryGymsRepository();
    sut = new CheckInsUseCase(inMemory, inMemoryGyms);

    await inMemoryGyms.create({
      id: 'gym-1',
      title: 'JS Node',
      description: '',
      phone: '',
      latitude: -23.4216355,
      longitude: -51.8628502
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('Should be able to check in', async () => {

    const { checkIn } = await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitude: -23.4216355,
      userLongitude: -51.8628502
    });

    expect(checkIn.id).toEqual(expect.any(String)); 

  });

  it('Should not be able to check in twice in the same day', async () => {

    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitude: -23.4216355,
      userLongitude: -51.8628502
    });

    await expect(() => 
      sut.execute({
        gymId: 'gym-1',
        userId: 'user-1',
        userLatitude: -23.4216355,
        userLongitude: -51.8628502
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it('Should not be able to check in twice but in different days', async () => {

    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitude: -23.4216355,
      userLongitude: -51.8628502
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    
    const {checkIn} = await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitude: -23.4216355,
      userLongitude: -51.8628502
    });

    expect(checkIn.id).toEqual(expect.any(String)); 
  });

  it('Should not be able to check in on distant gym', async () => {

    inMemoryGyms.items.push({
      id: 'gym-2',
      title: 'JS Node',
      description: '',
      phone: '',
      latitude: new Decimal(-23.4316091),
      longitude: new Decimal(-51.9430844)
    });

    expect(async () => 
      await sut.execute({
        gymId: 'gym-2',
        userId: 'user-1',
        userLatitude: -23.4216355,
        userLongitude: -51.8628502
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });

});