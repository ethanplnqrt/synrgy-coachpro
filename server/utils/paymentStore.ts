import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const SUBSCRIPTIONS_PATH = path.join(process.cwd(), "server/data/subscriptions.json");
const REFERRALS_PATH = path.join(process.cwd(), "server/data/referrals.json");

// Ensure files exist
function ensureFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]", "utf-8");
  }
}

// ===== SUBSCRIPTIONS =====

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: "active" | "canceled" | "expired" | "trial";
  startDate: string;
  endDate?: string;
  stripeSubscriptionId?: string;
  referralCode?: string;
  discount?: number;
}

export function getSubscriptions(): Subscription[] {
  ensureFile(SUBSCRIPTIONS_PATH);
  const data = fs.readFileSync(SUBSCRIPTIONS_PATH, "utf-8");
  return JSON.parse(data);
}

export function saveSubscriptions(subscriptions: Subscription[]) {
  fs.writeFileSync(SUBSCRIPTIONS_PATH, JSON.stringify(subscriptions, null, 2));
}

export function getUserSubscription(userId: string): Subscription | null {
  const subscriptions = getSubscriptions();
  return subscriptions.find(s => s.userId === userId && s.status === "active") || null;
}

export function createSubscription(data: Omit<Subscription, "id">): Subscription {
  const subscriptions = getSubscriptions();
  const newSubscription: Subscription = {
    id: uuidv4(),
    ...data,
  };
  subscriptions.push(newSubscription);
  saveSubscriptions(subscriptions);
  return newSubscription;
}

export function updateSubscriptionStatus(userId: string, status: Subscription["status"]) {
  const subscriptions = getSubscriptions();
  const index = subscriptions.findIndex(s => s.userId === userId);
  if (index !== -1) {
    subscriptions[index].status = status;
    if (status === "canceled" || status === "expired") {
      subscriptions[index].endDate = new Date().toISOString();
    }
    saveSubscriptions(subscriptions);
    return subscriptions[index];
  }
  return null;
}

// ===== REFERRALS =====

export interface Referral {
  id: string;
  code: string;
  coachId: string;
  coachName: string;
  createdAt: string;
  usedBy: Array<{
    userId: string;
    userName: string;
    usedAt: string;
  }>;
  discount: number; // Percentage
}

export function getReferrals(): Referral[] {
  ensureFile(REFERRALS_PATH);
  const data = fs.readFileSync(REFERRALS_PATH, "utf-8");
  return JSON.parse(data);
}

export function saveReferrals(referrals: Referral[]) {
  fs.writeFileSync(REFERRALS_PATH, JSON.stringify(referrals, null, 2));
}

export function getCoachReferrals(coachId: string): Referral[] {
  const referrals = getReferrals();
  return referrals.filter(r => r.coachId === coachId);
}

export function getReferralByCode(code: string): Referral | null {
  const referrals = getReferrals();
  return referrals.find(r => r.code.toUpperCase() === code.toUpperCase()) || null;
}

export function createReferralCode(coachId: string, coachName: string): Referral {
  const referrals = getReferrals();
  
  // Check if coach already has a code
  const existing = referrals.find(r => r.coachId === coachId);
  if (existing) return existing;

  // Generate unique code
  const code = `SYNRGY-${coachName.split(" ")[0].toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const newReferral: Referral = {
    id: uuidv4(),
    code,
    coachId,
    coachName,
    createdAt: new Date().toISOString(),
    usedBy: [],
    discount: 20, // 20% discount by default
  };

  referrals.push(newReferral);
  saveReferrals(referrals);
  return newReferral;
}

export function useReferralCode(code: string, userId: string, userName: string): boolean {
  const referrals = getReferrals();
  const index = referrals.findIndex(r => r.code.toUpperCase() === code.toUpperCase());
  
  if (index === -1) return false;

  // Check if user already used this code
  const alreadyUsed = referrals[index].usedBy.some(u => u.userId === userId);
  if (alreadyUsed) return false;

  referrals[index].usedBy.push({
    userId,
    userName,
    usedAt: new Date().toISOString(),
  });

  saveReferrals(referrals);
  return true;
}

// ===== PAYMENT MODE DETECTION =====

export function isStripeConfigured(): boolean {
  return !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith("sk_"));
}

export function getPaymentMode(): "mock" | "stripe" {
  return isStripeConfigured() ? "stripe" : "mock";
}

