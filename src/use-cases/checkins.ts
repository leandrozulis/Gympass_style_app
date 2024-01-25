import { CheckIn } from '@prisma/client';
import { CheckInsRepository } from '@/repositories/check-ins-repository';

interface CheckInsUseCaseRequest {
  userId: string
  gymId: string
}

interface CheckInsUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInsUseCase {
  constructor( private checkInsRepository: CheckInsRepository ) {}

  async execute({ userId, gymId }: CheckInsUseCaseRequest) : Promise<CheckInsUseCaseResponse> {

    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId
    });

    return {
      checkIn
    };

  }
}