import type { FastifyPluginCallback } from "fastify";
import { z } from "zod";
import { db } from "../database/connection.ts";
import { schema } from "../database/schemas/index.ts";

const createQuestionBodySchema = z.object({
  question: z.string().min(1),
});

const createQuestionParamsSchema = z.object({
  id: z.string().uuid(),
});

type CreateQuestionBody = z.infer<typeof createQuestionBodySchema>;
type CreateQuestionParams = z.infer<typeof createQuestionParamsSchema>;

export const createQuestionRoute: FastifyPluginCallback = (app) => {
  app.post<{ Body: CreateQuestionBody; Params: CreateQuestionParams }>(
    "/rooms/:id/questions",
    {
      schema: {
        params: createQuestionParamsSchema,
        body: createQuestionBodySchema,
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { question } = request.body;

      const [result] = await db
        .insert(schema.questions)
        .values({
          question,
          answer: "",
          roomId: id,
        })
        .returning();

      return reply.status(201).send({
        id: result.id,
      });
    }
  );
};
