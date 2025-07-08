import { desc } from "drizzle-orm";
import type { FastifyPluginCallback } from "fastify";
import { db } from "../database/connection.ts";
import { schema } from "../database/schemas/index.ts";

export const getRoomsRoute: FastifyPluginCallback = (app) => {
  app.get("/rooms", async (_, reply) => {
    const results = await db
      .select({
        id: schema.rooms.id,
        name: schema.rooms.name,
      })
      .from(schema.rooms)
      .orderBy(desc(schema.rooms.createdAt));

    return reply.status(200).send(results);
  });
};
