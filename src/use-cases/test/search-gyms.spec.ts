import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { describe, it, expect, beforeEach } from 'vitest';
import { SearchGymsUseCase } from '../search-gyms';

let inMemory: InMemoryGymsRepository;
let sut: SearchGymsUseCase;


describe('Search Gyms Use Case', () => {

  beforeEach( async () => {
    inMemory = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(inMemory);

  });

  it('Should be able to search for gyms', async () => {

    await inMemory.create({
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: -23.4216355,
      longitude: -51.8628502
    });

    await inMemory.create({
      title: 'TypeScript Gym',
      description: '',
      phone: '',
      latitude: -23.4216355,
      longitude: -51.8628502
    });

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 1
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: 'JavaScript Gym'}),
    ]);

  });

  it.skip('Should be able to fetch paginated gyms search', async () => {

    for (let i = 1; i <= 22; i++) {
      await inMemory.create({
        title: `JavaScript Gym ${i}`,
        description: '',
        phone: '',
        latitude: -23.4216355,
        longitude: -51.8628502
      });
    }

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 2
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript Gym 21' }),
      expect.objectContaining({ title: 'JavaScript Gym 22' }),
    ]);

  });

});