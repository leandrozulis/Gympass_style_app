import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { CheckInsUseCase } from './check-ins';

let inMemory: InMemoryCheckInsRepository;
let sut: CheckInsUseCase;


describe('Check-in Use Case', () => {

  beforeEach(() => {
    inMemory = new InMemoryCheckInsRepository();
    sut = new CheckInsUseCase(inMemory);
  });

  it('Should be able to check in', async () => {

    const { checkIn } = await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1'
    });

    expect(checkIn.id).toEqual(expect.any(String)); 

  });

});