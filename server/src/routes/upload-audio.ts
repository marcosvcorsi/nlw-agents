import type { FastifyPluginCallback } from "fastify";
import { z } from "zod";
import { db } from "../database/connection.ts";
import { audioChunks } from "../database/schemas/audio-chunks.ts";
import { generateEmbeddings, transcribeAudio } from "../services/gemini.ts";

const uploadAudioParamsSchema = z.object({
  id: z.string().uuid(),
});

type UploadAudioParams = z.infer<typeof uploadAudioParamsSchema>;

export const uploadAudioRoute: FastifyPluginCallback = (app) => {
  app.post<{ Params: UploadAudioParams }>(
    "/rooms/:id/audio",
    {
      schema: {
        params: uploadAudioParamsSchema,
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const audio = await request.file();

      if (!audio) {
        return reply.status(400).send({
          error: "No audio file provided",
        });
      }

      const audioBuffer = await audio.toBuffer();
      const audioAsBase64 = audioBuffer.toString("base64");
      const mimeType = audio.mimetype;

      const transcription = await transcribeAudio(audioAsBase64, mimeType);

      const embeddings = await generateEmbeddings(transcription);

      const [audioChunk] = await db
        .insert(audioChunks)
        .values({
          roomId: id,
          transcription,
          embedding: embeddings,
        })
        .returning();

      if (!audioChunk) {
        return reply.status(500).send({
          error: "Failed to create audio chunk",
        });
      }

      return reply.status(201).send(audioChunk);
    }
  );
};
