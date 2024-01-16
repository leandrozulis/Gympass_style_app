import { describe, it, expect } from 'vitest';
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

describe('Register Use Case', () => {

  it('Validando se o cadastro funciona', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const register = new RegisterUseCase(usersRepository);

    const { user } = await register.execute({
      name: 'Leandro',
      email: 'leandro@teste.com',
      password: '123456'
    });

    expect(user.id).toEqual(expect.any(String));

  });

  it('Validando se a senha gera um hash', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const register = new RegisterUseCase(usersRepository);

    const { user } = await register.execute({
      name: 'Leandro',
      email: 'leandro@teste.com',
      password: '123456'
    });

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);

  });

  it('Validando se já existe um e-mail', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const register = new RegisterUseCase(usersRepository);

    const email = 'leandro@teste.com';

    await register.execute({
      name: 'Leandro',
      email: email,
      password: '123456'
    });

    expect(() => 
      register.execute({
        name: 'Leandro',
        email,
        password: '123456'
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);

  });
});