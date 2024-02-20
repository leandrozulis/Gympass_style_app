import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { hash } from 'bcryptjs';
import { GetUserProfileUseCase } from '../get-users-profile';
import { ResourceNotFoundError } from '../errors/resource-not-found-erro';

let inMemory : InMemoryUsersRepository;
let sut : GetUserProfileUseCase;

describe('Get Users Profile Use Case', () => {

  beforeEach(() => {
    inMemory = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(inMemory);
  });

  it('should be able to get user profile', async () => {

    const createUser = await inMemory.create({
      name: 'Leandro',
      email: 'leandro@teste.com',
      password_hash: await hash('123456', 6)
    });

    const {user} = await sut.execute({
      userId: createUser.id
    });

    expect(user.name).toEqual('Leandro');

  });

  it('should not be able to get user profile with wrong id', async () => {

    await expect(() => 
      sut.execute({
        userId: 'non-existing-id'
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);

  });

});