import { FetchNearbyGymsUseCase } from '../fetch-nearby-gyms';
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository';

export function makeFetchNearbyGymsUseCase() {
  const checkInsRepository = new PrismaGymsRepository();
  const useCase = new FetchNearbyGymsUseCase(checkInsRepository);

  return useCase;
}