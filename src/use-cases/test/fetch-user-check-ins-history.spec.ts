import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { FetchUserCheckInsHistoryUseCase } from '../fetch-user-check-ins-history';

let inMemory: InMemoryCheckInsRepository;
let sut: FetchUserCheckInsHistoryUseCase;


describe('Fetch User Check-in History Use Case', () => {

  beforeEach( async () => {
    inMemory = new InMemoryCheckInsRepository();
    sut = new FetchUserCheckInsHistoryUseCase(inMemory);

  });

  it('Should be able to fetch check-in history', async () => {

    await inMemory.create({
      gym_id: 'gym-01',
      user_id: 'user-1'
    });

    await inMemory.create({
      gym_id: 'gym-02',
      user_id: 'user-1'
    });

    const { checkIns } = await sut.execute({
      userId: 'user-1',
      page: 1
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01'}),
      expect.objectContaining({ gym_id: 'gym-02'})
    ]);

  });

  it('Should be able to fetch paginated user check-in history', async () => {

    for (let i = 1; i <= 22; i++) {
      await inMemory.create({
        gym_id: `gym-${i}`,
        user_id: 'user-1'
      });
    }

    const { checkIns } = await sut.execute({
      userId: 'user-1',
      page: 2
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21'}),
      expect.objectContaining({ gym_id: 'gym-22'})
    ]);

  });

});