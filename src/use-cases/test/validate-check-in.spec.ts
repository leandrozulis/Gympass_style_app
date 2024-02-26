import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { ValidateCheckInsUseCase } from '../validate-check-ins';
import { ResourceNotFoundError } from '../errors/resource-not-found-erro';

let inMemory: InMemoryCheckInsRepository;
let sut: ValidateCheckInsUseCase;


describe('Validate Check-in Use Case', () => {

  beforeEach( async () => {
    inMemory = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInsUseCase(inMemory);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('Should be able to validate the check-in', async () => {

    const createdCheckIn = await inMemory.create({
      gym_id: 'gym-01',
      user_id: 'user-01'
    });

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(inMemory.items[0].validated_at).toEqual(expect.any(Date));

  });

  it('Should not be able to validate and inexistent check-in', async () => {

    expect(async () => 
      await sut.execute({
        checkInId: 'inexistent-check-in-id'
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);

  });

  it('Should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023,0,1, 13, 40));

    const createdCheckIn = await inMemory.create({
      gym_id: 'gym-01',
      user_id: 'user-01'
    });

    const twentyOneMinutesInMs = 1000 * 60 * 21;

    vi.advanceTimersByTime(twentyOneMinutesInMs);

    expect(async () => 
      await sut.execute({
        checkInId: createdCheckIn.id
      })
    ).rejects.toBeInstanceOf(Error);

  });

});