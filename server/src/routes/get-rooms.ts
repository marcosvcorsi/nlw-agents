import { count, desc, eq } from "drizzle-orm";
import type { FastifyPluginCallback } from "fastify";
import { db } from "../database/connection.ts";
import { schema } from "../database/schemas/index.ts";

export const getRoomsRoute: FastifyPluginCallback = (app) => {
  app.get("/rooms", async (_, reply) => {
    const results = await db
      .select({
        id: schema.rooms.id,
        name: schema.rooms.name,
        questionCount: count(schema.questions.id),
        createdAt: schema.rooms.createdAt,
      })
      .from(schema.rooms)
      .leftJoin(schema.questions, eq(schema.rooms.id, schema.questions.roomId))
      .groupBy(schema.rooms.id)
      .orderBy(desc(schema.rooms.createdAt));

    return reply.status(200).send(results);
  });
};
