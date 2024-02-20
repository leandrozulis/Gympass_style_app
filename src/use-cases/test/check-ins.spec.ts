import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { CheckInsUseCase } from '../check-ins';

let inMemory: InMemoryCheckInsRepository;
let sut: CheckInsUseCase;


describe('Check-in Use Case', () => {

  beforeEach(() => {
    inMemory = new InMemoryCheckInsRepository();
    sut = new CheckInsUseCase(inMemory);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('Should be able to check in', async () => {

    const { checkIn } = await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1'
    });

    expect(checkIn.id).toEqual(expect.any(String)); 

  });

  it('Should not be able to check in twice in the same day', async () => {

    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1'
    });

    await expect(() => 
      sut.execute({
        gymId: 'gym-1',
        userId: 'user-1'
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it('Should not be able to check in twice but in different days', async () => {

    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1'
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    
    const {checkIn} = await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1'
    });

    expect(checkIn.id).toEqual(expect.any(String)); 
  });

});