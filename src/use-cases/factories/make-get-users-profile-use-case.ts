import { PrismaUsersRespository } from '@/repositories/prisma/prisma-users-repository';
import { GetUserProfileUseCase } from '../get-users-profile';

export function makeGetUsersProfileUseCase() {
  const usersRepository = new PrismaUsersRespository();
  const useCase = new GetUserProfileUseCase(usersRepository);

  return useCase;
}