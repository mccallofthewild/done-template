const Greeting = Done.item<string>("greeting");

interface SetGreetingBody {
  greeting: string;
}

const DEFAULT_GREETING = "Hello from Done";

export default Done.serve()
  .instantiate(async () => {
    const existing = await Greeting.load();
    if (!existing) {
      await Greeting.save(DEFAULT_GREETING);
    }
  })
  .query("/greeting", async () => {
    const greeting = await Greeting.load();
    return {
      greeting: greeting ?? DEFAULT_GREETING,
    };
  })
  .transaction(
    "/greeting",
    async ({ body }) => {
      const payload = (body ?? {}) as Partial<SetGreetingBody>;
      const next = payload.greeting?.trim();

      if (!next) {
        throw new Error("greeting text required");
      }

      await Greeting.save(next);

      return { greeting: next };
    },
    {
      body: {
        type: "object",
        properties: {
          greeting: {
            type: "string",
            minLength: 1,
            maxLength: 280,
          },
        },
        required: ["greeting"],
        additionalProperties: false,
      },
    },
  );
