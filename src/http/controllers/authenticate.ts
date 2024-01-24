import { InvalidCredentialError } from '@/use-cases/errors/invalid-credentials-error';
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {

  const authenticateSchemaBody = z.object({
    email: z.string(),
    password: z.string()
  });

  const { email, password } = authenticateSchemaBody.parse(request.body);

  try {

    const authenticateUseCase = makeAuthenticateUseCase();

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