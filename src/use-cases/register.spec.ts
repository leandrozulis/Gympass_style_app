import { describe, it, expect, beforeEach } from 'vitest';
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

let inMemory: InMemoryUsersRepository;
let sut: RegisterUseCase;


describe('Register Use Case', () => {

  beforeEach(() => {
    inMemory = new InMemoryUsersRepository();
    sut = new RegisterUseCase(inMemory);
  });

  it('Validando se o cadastro funciona', async () => {

    const { user } = await sut.execute({
      name: 'Leandro',
      email: 'leandro@teste.com',
      password: '123456'
    });

    expect(user.id).toEqual(expect.any(String));

  });

  it('Validando se a senha gera um hash', async () => {

    const { user } = await sut.execute({
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

    const email = 'leandro@teste.com';

    await sut.execute({
      name: 'Leandro',
      email: email,
      password: '123456'
    });

    await expect(() => 
      sut.execute({
        name: 'Leandro',
        email,
        password: '123456'
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);

  });
});