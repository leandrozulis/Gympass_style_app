import { PrismaUsersRespository } from '@/repositories/prisma/prisma-users-repository';
import { RegisterUseCase } from '../register';

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRespository();
  const registerUseCase = new RegisterUseCase(usersRepository);

  return registerUseCase;
}