import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { CheckInsUseCase } from '../check-ins';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';

let inMemory: InMemoryCheckInsRepository;
let inMemoryGyms: InMemoryGymsRepository;
let sut: CheckInsUseCase;


describe('Check-in Use Case', () => {

  beforeEach(() => {
    inMemory = new InMemoryCheckInsRepository();
    inMemoryGyms = new InMemoryGymsRepository();
    sut = new CheckInsUseCase(inMemory, inMemoryGyms);

    inMemoryGyms.items.push({
      id: 'gym-1',
      title: 'JS Node',
      description: '',
      phone: '',
      latitude: new Decimal(0),
      longitude: new Decimal(0)
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
      latitude: -23.4216355,
      longitude: -51.8628502
    });

    expect(checkIn.id).toEqual(expect.any(String)); 

  });

  it('Should not be able to check in twice in the same day', async () => {

    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      latitude: -23.4216355,
      longitude: -51.8628502
    });

    await expect(() => 
      sut.execute({
        gymId: 'gym-1',
        userId: 'user-1',
        latitude: -23.4216355,
        longitude: -51.8628502
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it('Should not be able to check in twice but in different days', async () => {

    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      latitude: -23.4216355,
      longitude: -51.8628502
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    
    const {checkIn} = await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      latitude: -23.4216355,
      longitude: -51.8628502
    });

    //-23.4216355,,14z

    expect(checkIn.id).toEqual(expect.any(String)); 
  });

});