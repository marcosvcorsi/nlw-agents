import { desc, eq } from "drizzle-orm";
import type { FastifyPluginCallback } from "fastify";
import { z } from "zod";
import { db } from "../database/connection.ts";
import { schema } from "../database/schemas/index.ts";

const getRoomQuestionsParamsSchema = z.object({
  id: z.string().uuid(),
});

type GetRoomQuestionsParams = z.infer<typeof getRoomQuestionsParamsSchema>;

export const getRoomQuestionsRoute: FastifyPluginCallback = (app) => {
  app.get<{ Params: GetRoomQuestionsParams }>(
    "/rooms/:id/questions",
    {
      schema: {
        params: getRoomQuestionsParamsSchema,
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const results = await db
        .select({
          id: schema.questions.id,
          question: schema.questions.question,
          answer: schema.questions.answer,
          createdAt: schema.questions.createdAt,
        })
        .from(schema.questions)
        .where(eq(schema.questions.roomId, id))
        .orderBy(desc(schema.questions.createdAt));

      return reply.status(200).send(results);
    }
  );
};
