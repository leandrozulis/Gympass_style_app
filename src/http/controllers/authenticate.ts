import { PrismaUsersRespository } from '@/repositories/prisma/prisma-users-repository';
import { AuthenticateUseCase } from '@/use-cases/authenticate';
import { InvalidCredentialError } from '@/use-cases/errors/invalid-credentials-error';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {

  const authenticateSchemaBody = z.object({
    email: z.string(),
    password: z.string().min(6)
  });

  const { email, password } = authenticateSchemaBody.parse(request.body);

  try {

    const usersRepository = new PrismaUsersRespository();
    const authenticateUseCase = new AuthenticateUseCase(usersRepository);

    await authenticateUseCase.execute({
      email,
      password
    });

  } catch (err) {
    if (err instanceof InvalidCredentialError) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }

  return reply.status(200).send();

}