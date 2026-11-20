export interface UserCredits {
  remaining: number;
  total: number;
  plan: "free" | "pro";
  periodStart: string;
  periodEnd: string;
}

interface Env {
  METADATA: {
    get<T>(key: string, type: "json"): Promise<T | null>;
    put(key: string, value: string): Promise<void>;
  };
}

const DEFAULT_FREE_CREDITS = 50;

const UNLIMITED_CREDITS = -1;

export const FREE_PROJECT_LIMIT = 3;

function createBillingPeroid(): { periodStart: string; periodEnd: string } {
  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  return {
    periodStart: now.toISOString(),
    periodEnd: periodEnd.toISOString(),
  };
}

async function checkAndResetPeriod(credits: UserCredits, userId: string, env: Env): Promise<UserCredits> {
  const now = new Date();
  const periodEnd = new Date(credits.periodEnd);

  if (now < periodEnd) {
    return credits;
  }

  const newPeriod = createBillingPeroid();

  const resetCredits: UserCredits = {
    ...credits,
    remaining: credits.plan === "free" ? DEFAULT_FREE_CREDITS : UNLIMITED_CREDITS,
    periodStart: newPeriod.periodStart,
    periodEnd: newPeriod.periodEnd,
  };

  await env.METADATA.put(`credits:${userId}`, JSON.stringify(resetCredits));

  return resetCredits;
}

export async function getCredits(
  userId: string,
  env: Env,
): Promise<UserCredits> {
  const credits = await env.METADATA.get<UserCredits>(
    `credits:${userId}`,
    "json",
  );
  if (credits) {
    return checkAndResetPeriod(credits, userId, env);
  }

  return initializeCredits(userId, env, "free");
}

export async function initializeCredits(
  userId: string,
  env: Env,
  plan: "free" | "pro"
): Promise<UserCredits> {
  const period = createBillingPeroid();

  const newCredits: UserCredits = {
    remaining: plan === "free" ? DEFAULT_FREE_CREDITS : UNLIMITED_CREDITS,
    total: DEFAULT_FREE_CREDITS,
    plan,
    periodStart: period.periodStart,
    periodEnd: period.periodEnd,
  };

  await env.METADATA.put(`credits:${userId}`, JSON.stringify(newCredits));

  return newCredits;
}