import { describe, it, expect } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateUseCase } from './authenticate';
import { hash } from 'bcryptjs';
import { InvalidCredentialError } from './errors/invalid-credentials-error';

describe('Authenticate Use Case', () => {

  it('Validando se o usário se conecta', async () => {
    const authenticateRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(authenticateRepository);

    await authenticateRepository.create({
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

    const authenticateRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(authenticateRepository);

    expect(() => 
      sut.execute({
        email: 'leandro@teste.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialError);

  });

  it('Validando se a senha existe', async () => {

    const authenticateRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(authenticateRepository);

    await authenticateRepository.create({
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