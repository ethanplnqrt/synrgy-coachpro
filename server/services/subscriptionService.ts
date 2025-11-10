import { promises as fs } from "fs";
import { join } from "path";

const SUBSCRIPTIONS_FILE = join(process.cwd(), "server/data/subscriptions.json");
const USERS_FILE = join(process.cwd(), "server/data/users.json");

export interface Subscription {
  id: string;
  userId: string;
  plan: string;
  status: "active" | "canceled" | "expired" | "past_due";
  startDate: string;
  renewalDate?: string;
  endDate?: string;
  stripeSubscriptionId?: string;
  referralCode?: string;
  discount?: number;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: string;
  createdAt: number;
  subscription?: {
    plan: string;
    status: string;
    startDate: string;
    renewalDate?: string;
  };
}

// Ensure data files exist
async function ensureDataFiles() {
  try {
    await fs.access(SUBSCRIPTIONS_FILE);
  } catch {
    await fs.writeFile(SUBSCRIPTIONS_FILE, "[]", "utf-8");
  }
  
  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, "[]", "utf-8");
  }
}

// Read subscriptions
async function readSubscriptions(): Promise<Subscription[]> {
  await ensureDataFiles();
  const data = await fs.readFile(SUBSCRIPTIONS_FILE, "utf-8");
  return JSON.parse(data || "[]");
}

// Write subscriptions
async function writeSubscriptions(subscriptions: Subscription[]): Promise<void> {
  await fs.writeFile(SUBSCRIPTIONS_FILE, JSON.stringify(subscriptions, null, 2), "utf-8");
}

// Read users
async function readUsers(): Promise<User[]> {
  await ensureDataFiles();
  const data = await fs.readFile(USERS_FILE, "utf-8");
  return JSON.parse(data || "[]");
}

// Write users
async function writeUsers(users: User[]): Promise<void> {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

/**
 * Update subscription for a user
 * Creates or updates subscription in subscriptions.json and users.json
 */
export async function updateSubscription(
  userId: string,
  email: string,
  plan: string,
  status: "active" | "canceled" | "expired" | "past_due",
  options?: {
    stripeSubscriptionId?: string;
    referralCode?: string;
    discount?: number;
    renewalDate?: string;
  }
): Promise<Subscription> {
  const subscriptions = await readSubscriptions();
  const users = await readUsers();

  // Find existing subscription
  const existingIndex = subscriptions.findIndex(sub => sub.userId === userId);
  
  const now = new Date().toISOString();
  const renewalDate = options?.renewalDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  
  let subscription: Subscription;

  if (existingIndex >= 0) {
    // Update existing subscription
    subscription = {
      ...subscriptions[existingIndex],
      plan,
      status,
      ...(status === "active" && { renewalDate }),
      ...(status === "canceled" && { endDate: now }),
      ...(options?.stripeSubscriptionId && { stripeSubscriptionId: options.stripeSubscriptionId }),
      ...(options?.referralCode && { referralCode: options.referralCode }),
      ...(options?.discount && { discount: options.discount }),
    };
    subscriptions[existingIndex] = subscription;
  } else {
    // Create new subscription
    subscription = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      plan,
      status,
      startDate: now,
      renewalDate: status === "active" ? renewalDate : undefined,
      stripeSubscriptionId: options?.stripeSubscriptionId,
      referralCode: options?.referralCode,
      discount: options?.discount,
    };
    subscriptions.push(subscription);
  }

  // Update users.json
  const userIndex = users.findIndex(u => u.id === userId || u.email === email);
  if (userIndex >= 0) {
    users[userIndex].subscription = {
      plan,
      status,
      startDate: subscription.startDate,
      renewalDate: subscription.renewalDate,
    };
  }

  // Write to files
  await writeSubscriptions(subscriptions);
  await writeUsers(users);

  // Log the update
  const statusEmoji = status === "active" ? "✅" : status === "canceled" ? "❌" : "⚠️";
  console.log(`${statusEmoji} Subscription ${status} for ${email} (${plan.toUpperCase()})`);
  console.log(`   → Subscription ID: ${subscription.id}`);
  if (subscription.stripeSubscriptionId) {
    console.log(`   → Stripe Sub ID: ${subscription.stripeSubscriptionId}`);
  }
  if (subscription.discount) {
    console.log(`   → Réduction: -${subscription.discount}%`);
  }
  if (subscription.renewalDate && status === "active") {
    console.log(`   → Renouvellement: ${new Date(subscription.renewalDate).toLocaleDateString()}`);
  }

  return subscription;
}

/**
 * Get subscription by user ID
 */
export async function getSubscriptionByUserId(userId: string): Promise<Subscription | null> {
  const subscriptions = await readSubscriptions();
  return subscriptions.find(sub => sub.userId === userId) || null;
}

/**
 * Get all subscriptions (admin only)
 */
export async function getAllSubscriptions(): Promise<Subscription[]> {
  return readSubscriptions();
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(userId: string, email: string): Promise<Subscription | null> {
  const subscription = await getSubscriptionByUserId(userId);
  
  if (!subscription) {
    console.warn(`⚠️  Aucun abonnement trouvé pour userId: ${userId}`);
    return null;
  }

  if (subscription.status === "canceled") {
    console.log(`ℹ️  Abonnement déjà annulé pour ${email}`);
    return subscription;
  }

  // Update to canceled status
  return updateSubscription(userId, email, subscription.plan, "canceled", {
    stripeSubscriptionId: subscription.stripeSubscriptionId,
    referralCode: subscription.referralCode,
    discount: subscription.discount,
  });
}

/**
 * Check and update expired subscriptions
 */
export async function checkExpiredSubscriptions(): Promise<void> {
  const subscriptions = await readSubscriptions();
  const now = new Date();
  let updated = false;

  for (const subscription of subscriptions) {
    if (subscription.status === "active" && subscription.renewalDate) {
      const renewalDate = new Date(subscription.renewalDate);
      if (now > renewalDate) {
        subscription.status = "expired";
        subscription.endDate = subscription.renewalDate;
        console.log(`⏰ Abonnement expiré pour userId: ${subscription.userId} (${subscription.plan})`);
        updated = true;
      }
    }
  }

  if (updated) {
    await writeSubscriptions(subscriptions);
    
    // Update users.json
    const users = await readUsers();
    for (const user of users) {
      const subscription = subscriptions.find(sub => sub.userId === user.id);
      if (subscription && user.subscription) {
        user.subscription.status = subscription.status;
        if (subscription.endDate) {
          user.subscription.renewalDate = subscription.endDate;
        }
      }
    }
    await writeUsers(users);
  }
}

