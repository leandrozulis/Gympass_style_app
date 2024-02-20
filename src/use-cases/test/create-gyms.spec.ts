import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { CreateGymsUseCase } from '../create-gyms';

let inMemory: InMemoryGymsRepository;
let sut: CreateGymsUseCase;


describe('Create Gyms Use Case', () => {

  beforeEach(() => {
    inMemory = new InMemoryGymsRepository();
    sut = new CreateGymsUseCase(inMemory);
  });

  it('Validando se o cadastro funciona', async () => {

    const { gym } = await sut.execute({
      title: 'JS Node',
      description: '',
      phone: '',
      latitude: -23.4216355,
      longitude: -51.8628502
    });

    expect(gym.id).toEqual(expect.any(String));

  });

});