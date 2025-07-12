import { and, eq, sql } from "drizzle-orm";
import type { FastifyPluginCallback } from "fastify";
import { z } from "zod";
import { db } from "../database/connection.ts";
import { schema } from "../database/schemas/index.ts";
import { generateAnswer, generateEmbeddings } from "../services/gemini.ts";

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

      const embeddings = await generateEmbeddings(question);

      const embeddingAsString = `[${embeddings.join(",")}]`;

      const chunks = await db
        .select({
          id: schema.audioChunks.id,
          transcription: schema.audioChunks.transcription,
          similarity: sql<number>`1 - (${schema.audioChunks.embedding} <=> ${embeddingAsString}::vector)`,
        })
        .from(schema.audioChunks)
        .where(
          and(
            eq(schema.audioChunks.roomId, id),
            sql`1 - (${schema.audioChunks.embedding} <=> ${embeddingAsString}::vector) > 0.7`
          )
        )
        .orderBy(
          sql`1 - (${schema.audioChunks.embedding} <=> ${embeddingAsString}::vector)`
        )
        .limit(3);

      let answer = "";

      if (chunks.length > 0) {
        answer = await generateAnswer(
          question,
          chunks.map((chunk) => chunk.transcription)
        );
      }

      const [result] = await db
        .insert(schema.questions)
        .values({
          question,
          answer,
          roomId: id,
        })
        .returning();

      return reply.status(201).send({
        id: result.id,
        answer,
      });
    }
  );
};
