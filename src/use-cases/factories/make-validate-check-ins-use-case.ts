import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository';
import { ValidateCheckInsUseCase } from '../validate-check-ins';

export function makeValidateCheckInsUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const useCase = new ValidateCheckInsUseCase(checkInsRepository);

  return useCase;
}