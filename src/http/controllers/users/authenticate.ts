import { InvalidCredentialError } from '@/use-cases/errors/invalid-credentials-error';
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {

  const authenticateSchemaBody = z.object({
    email: z.string(),
    password: z.string().min(6)
  });

  const { email, password } = authenticateSchemaBody.parse(request.body);

  try {

    const authenticateUseCase = makeAuthenticateUseCase();

    const { user } = await authenticateUseCase.execute({
      email,
      password
    });

    const token = await reply.jwtSign({}, {
      sign: {
        sub: user.id
      }
    });

    const refreshToken = await reply.jwtSign({}, {
      sign: {
        sub: user.id,
        expiresIn: '7d'
      }
    });

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true
      })
      .status(200)
      .send({token});


  } catch (err) {
    if (err instanceof InvalidCredentialError) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }


}