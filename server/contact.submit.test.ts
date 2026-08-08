import { describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";
import { appRouter } from "./routers";
import { listContactSubmissions } from "./db";

vi.mock("./email", async importOriginal => {
  const actual = await importOriginal<typeof import("./email")>();
  return {
    ...actual,
    sendContactEmail: vi.fn().mockResolvedValue(true),
  };
});

vi.mock("./_core/notification", async importOriginal => {
  const actual = await importOriginal<typeof import("./_core/notification")>();
  return {
    ...actual,
    notifyOwner: vi.fn().mockResolvedValue(true),
  };
});

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("contact.submit", () => {
  it("stores the submission in the database and reports success", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    const result = await caller.contact.submit({
      name: "Test Visitor",
      email: "visitor@example.com",
      message: "Hello Prince, I'd like to discuss a project.",
    });

    expect(result.success).toBe(true);

    const stored = await listContactSubmissions();
    const latest = stored[0];
    expect(latest).toBeDefined();
    expect(latest!.name).toBe("Test Visitor");
    expect(latest!.email).toBe("visitor@example.com");
    expect(latest!.message).toContain("discuss a project");
  });

  it("sends an email notification to the owner", async () => {
    const { sendContactEmail } = await import("./email");
    const caller = appRouter.createCaller(createPublicContext());

    await caller.contact.submit({
      name: "Email Test",
      email: "emailtest@example.com",
      message: "Verify email delivery.",
    });

    expect(sendContactEmail).toHaveBeenCalledWith({
      name: "Email Test",
      email: "emailtest@example.com",
      message: "Verify email delivery.",
    });
  });

  it("rejects submissions with an invalid email address", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(
      caller.contact.submit({
        name: "Bad Email",
        email: "not-an-email",
        message: "Should be rejected",
      })
    ).rejects.toThrow();
  });

  it("throws when the email cannot be delivered but keeps the submission stored", async () => {
    const { sendContactEmail } = await import("./email");
    vi.mocked(sendContactEmail).mockRejectedValueOnce(new Error("SMTP down"));

    const caller = appRouter.createCaller(createPublicContext());

    await expect(
      caller.contact.submit({
        name: "Email Fails",
        email: "fails@example.com",
        message: "Delivery should fail on this run",
      })
    ).rejects.toThrow();

    const stored = await listContactSubmissions();
    expect(stored.find(s => s.name === "Email Fails")).toBeDefined();
  });

  it("rejects submissions with empty message", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(
      caller.contact.submit({
        name: "Empty Msg",
        email: "empty@example.com",
        message: "   ",
      })
    ).rejects.toThrow();
  });
});
