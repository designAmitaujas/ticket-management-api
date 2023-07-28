import { parseEnv } from "znv";
import { z } from "zod";

export const { PORT, JWT_SECRET, PASS_STRING } = parseEnv(process.env, {
  PORT: z.number().min(1),
  JWT_SECRET: z.string().min(1),
  PASS_STRING: z.string().min(1),
});
