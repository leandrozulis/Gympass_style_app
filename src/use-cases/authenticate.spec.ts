import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateUseCase } from './authenticate';
import { hash } from 'bcryptjs';
import { InvalidCredentialError } from './errors/invalid-credentials-error';

let inMemory: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate Use Case', () => {

  beforeEach(() => {
    inMemory = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(inMemory);
  });

  it('Validando se o usário se conecta', async () => {

    await inMemory.create({
      name: 'Leandro',
      email: 'leandro@teste.com',
      password_hash: await hash('123456', 6)
    });

    const { user } = await sut.execute({
      email: 'leandro@teste.com',
      password: '123456'
    });

    expect(user.id).toEqual(expect.any(String));

  });

  it('Validando se o email existe', async () => {

    expect(() => 
      sut.execute({
        email: 'leandro@teste.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialError);

  });

  it('Validando se a senha existe', async () => {


    await inMemory.create({
      name: 'Leandro',
      email: 'leandro@teste.com',
      password_hash: await hash('123456', 6)
    });

    expect(() => 
      sut.execute({
        email: 'leandro@teste.com',
        password: '123123'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialError);

  });

});