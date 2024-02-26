import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { describe, it, expect, beforeEach } from 'vitest';
import { FetchNearbyGymsUseCase } from '../fetch-nearby-gyms';

let inMemory: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;


describe('Fetch Nearby Gyms Use Case', () => {

  beforeEach( async () => {
    inMemory = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(inMemory);

  });

  it('Should be able to search for gyms', async () => {

    await inMemory.create({
      title: 'Near Gym',
      description: '',
      phone: '',
      latitude: -23.4216355,
      longitude: -51.8628502
    });

    await inMemory.create({
      title: 'For Gym',
      description: '',
      phone: '',
      latitude: -23.3066939,
      longitude: -51.213595
    });

    const { gyms } = await sut.execute({
      userLatitude: -23.4216355,
      userLongitude: -51.8628502
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym'}),
    ]);

  });

});