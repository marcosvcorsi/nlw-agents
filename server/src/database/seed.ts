import { reset, seed } from "drizzle-seed";
import { db, sql } from "./connection.ts";
import { schema } from "./schemas/index.ts";

await reset(db, schema);
await seed(db, schema).refine((f) => {
  return {
    rooms: {
      count: 20,
      columns: {
        name: f.companyName(),
        description: f.loremIpsum(),
      },
      with: {
        questions: [
          {
            weight: 1,
            count: 20,
            columns: {
              question: f.loremIpsum(),
              answer: f.loremIpsum(),
            },
          },
        ],
      },
    },
  };
});

await sql.end();

// biome-ignore lint: Database seeding feedback
console.log("Database seeded");
