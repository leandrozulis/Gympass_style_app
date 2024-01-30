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

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date()
    );
    
    if(checkInOnSameDay) {
      throw new Error;
    }

    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId
    });

    return {
      checkIn
    };

  }
}