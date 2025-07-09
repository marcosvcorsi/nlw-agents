import type { FastifyPluginCallback } from "fastify";
import { z } from "zod";
import { db } from "../database/connection.ts";
import { schema } from "../database/schemas/index.ts";

const createRoomBodySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

type CreateRoomBody = z.infer<typeof createRoomBodySchema>;

export const createRoomRoute: FastifyPluginCallback = (app) => {
  app.post<{ Body: CreateRoomBody }>(
    "/rooms",
    {
      schema: {
        body: createRoomBodySchema,
      },
    },
    async (request, reply) => {
      const { name, description } = request.body;

      const [result] = await db
        .insert(schema.rooms)
        .values({
          name,
          description,
        })
        .returning();

      return reply.status(201).send({
        id: result.id,
      });
    }
  );
};
