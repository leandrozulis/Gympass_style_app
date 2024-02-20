import { CheckIn } from '@prisma/client';
import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { GymsRepository } from '@/repositories/gyms-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-erro';

interface CheckInsUseCaseRequest {
  userId: string
  gymId: string
  latitude: number
  longitude: number
}

interface CheckInsUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInsUseCase {
  constructor( 
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository
  ) {}

  async execute({ userId, gymId }: CheckInsUseCaseRequest) : Promise<CheckInsUseCaseResponse> {

    const gym = await this.gymsRepository.findById(gymId);

    if(!gym) {
      throw new ResourceNotFoundError();
    }

    // Será realizado o calculo entre Gym e User

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