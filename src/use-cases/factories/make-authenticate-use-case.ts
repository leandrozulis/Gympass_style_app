import { PrismaUsersRespository } from '@/repositories/prisma/prisma-users-repository';
import { AuthenticateUseCase } from '../authenticate';

export function makeAuthenticateUseCase() {
  const usersRepository = new PrismaUsersRespository();
  const authenticateUseCase = new AuthenticateUseCase(usersRepository);

  return authenticateUseCase;
}