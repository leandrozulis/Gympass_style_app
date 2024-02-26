import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { GetUserMetricsUseCase } from '../get-user-metrics';

let inMemory: InMemoryCheckInsRepository;
let sut: GetUserMetricsUseCase;


describe('Get User Metrics Use Case', () => {

  beforeEach( async () => {
    inMemory = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsUseCase(inMemory);

  });

  it('Should be able to get check-ins count from metrics', async () => {

    await inMemory.create({
      gym_id: 'gym-01',
      user_id: 'user-1'
    });

    await inMemory.create({
      gym_id: 'gym-02',
      user_id: 'user-1'
    });

    const { checkInsCount } = await sut.execute({
      userId: 'user-1',
    });

    console.log(checkInsCount);

    expect(checkInsCount).toEqual(2);

  });

});