// functions/src/early-access.ts
import { onCall } from "firebase-functions/v2/https";
import { logger } from "firebase-functions";
import { HttpsError } from "firebase-functions/v2/https";
import { db } from "./admin.js";

export const submitEarlyAccess = onCall(
  { region: "us-central1" },
  async (request) => {
    try {
      const { email, name, useCase } = request.data ?? {};
      
      if (!email) {
        throw new HttpsError("invalid-argument", "email required");
      }

      await db.collection("early_access").add({
        email,
        name: name ?? null,
        useCase: useCase ?? null,
        createdAt: new Date(),
      });

      logger.info("Early access submission", { email });
      return { ok: true };
    } catch (err: any) {
      logger.error(err);
      if (err instanceof HttpsError) {
        throw err;
      }
      throw new HttpsError("internal", "internal error");
    }
  }
);
