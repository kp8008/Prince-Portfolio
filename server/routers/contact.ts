import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { createContactSubmission, listContactSubmissions } from "../db";
import { sendContactEmail } from "../email";
import { notifyOwner } from "../_core/notification";

const contactInput = z.object({
  name: z.string().trim().min(1, "Name is required").max(255),
  email: z.string().trim().email("A valid email is required").max(320),
  message: z.string().trim().min(1, "Message is required").max(10000),
});

export const contactRouter = router({
  /**
   * Receives a contact form submission, stores it in the database,
   * delivers it as an email to the owner, and pushes an owner notification.
   */
  submit: publicProcedure.input(contactInput).mutation(async ({ input }) => {
    try {
      await createContactSubmission(input);
    } catch (error) {
      console.error("[Contact] Failed to store submission:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not save your message. Please try again.",
      });
    }

    try {
      await sendContactEmail({
        name: input.name,
        email: input.email,
        message: input.message,
      });
    } catch (error) {
      // Submission is already stored in the database, but the email could not
      // be delivered — let the user know instead of silently succeeding.
      console.error("[Contact] Failed to send email:", error);
      try {
        await notifyOwner({
          title: `New contact: ${input.name}`,
          content: `From: ${input.email}\n\n${input.message}\n\n(NOTE: SMTP delivery failed, stored in DB)`,
        });
      } catch (notificationError) {
        console.error("[Contact] Owner notification also failed:", notificationError);
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Your message was saved, but it could not be emailed. Please try again shortly.",
      });
    }

    return { success: true } as const;
  }),

  /**
   * Lists stored submissions (owner only).
   */
  list: publicProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    return listContactSubmissions();
  }),
});
