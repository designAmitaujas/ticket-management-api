import { parseEnv } from "znv";
import { z } from "zod";

export const {
  PORT,
  JWT_SECRET,
  PASS_STRING,
  CCAVENUE_WORKING_KEY,
  MERCHANT_ID,
} = parseEnv(process.env, {
  PORT: z.number().min(1),
  JWT_SECRET: z.string().min(1),
  PASS_STRING: z.string().min(1),
  CCAVENUE_WORKING_KEY: z.string().min(1),
  MERCHANT_ID: z.string().min(1),
});
