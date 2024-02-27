import { CreateGymsUseCase } from '../create-gyms';
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository';

export function makeCreateGymUseCase() {
  const checkInsRepository = new PrismaGymsRepository();
  const useCase = new CreateGymsUseCase(checkInsRepository);

  return useCase;
}