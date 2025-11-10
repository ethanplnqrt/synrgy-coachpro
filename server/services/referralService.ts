import { promises as fs } from "fs";
import { join } from "path";

const REFERRALS_FILE = join(process.cwd(), "server/data/referrals.json");
const USERS_FILE = join(process.cwd(), "server/data/users.json");

export interface ReferralUsage {
  userId: string;
  userName: string;
  userEmail: string;
  usedAt: string;
  amountSaved: number; // Amount saved by client in EUR
  commissionEarned: number; // Commission earned by coach in EUR
}

export interface Referral {
  id: string;
  code: string;
  coachId: string;
  coachName: string;
  coachEmail: string;
  createdAt: string;
  usedBy: ReferralUsage[];
  discount: number; // Percentage (e.g., 20 for 20%)
  commission: number; // Percentage (e.g., 10 for 10%)
  isActive: boolean;
}

export interface ReferralStats {
  totalCodes: number;
  totalUsages: number;
  totalCommissions: number; // Total EUR
  totalSavings: number; // Total EUR saved by clients
}

// Ensure data files exist
async function ensureDataFiles() {
  try {
    await fs.access(REFERRALS_FILE);
  } catch {
    await fs.writeFile(REFERRALS_FILE, "[]", "utf-8");
  }
}

// Read referrals
async function readReferrals(): Promise<Referral[]> {
  await ensureDataFiles();
  const data = await fs.readFile(REFERRALS_FILE, "utf-8");
  return JSON.parse(data || "[]");
}

// Write referrals
async function writeReferrals(referrals: Referral[]): Promise<void> {
  await fs.writeFile(REFERRALS_FILE, JSON.stringify(referrals, null, 2), "utf-8");
}

// Read users
async function readUsers(): Promise<any[]> {
  try {
    const data = await fs.readFile(USERS_FILE, "utf-8");
    return JSON.parse(data || "[]");
  } catch {
    return [];
  }
}

// Write users
async function writeUsers(users: any[]): Promise<void> {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

/**
 * Generate a unique referral code
 */
function generateReferralCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SYNRGY-${code}`;
}

/**
 * Create a referral code for a coach
 * Each coach gets one code by default
 */
export async function createReferralCode(
  coachId: string,
  coachName: string,
  coachEmail: string,
  options?: {
    discount?: number;
    commission?: number;
  }
): Promise<Referral> {
  const referrals = await readReferrals();

  // Check if coach already has an active code
  const existingCode = referrals.find(
    (r) => r.coachId === coachId && r.isActive
  );

  if (existingCode) {
    console.log(`ℹ️  Coach ${coachEmail} already has an active code: ${existingCode.code}`);
    return existingCode;
  }

  // Generate unique code
  let code = generateReferralCode();
  while (referrals.some((r) => r.code === code)) {
    code = generateReferralCode();
  }

  const referral: Referral = {
    id: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    code,
    coachId,
    coachName,
    coachEmail,
    createdAt: new Date().toISOString(),
    usedBy: [],
    discount: options?.discount || 20, // 20% discount for client
    commission: options?.commission || 10, // 10% commission for coach
    isActive: true,
  };

  referrals.push(referral);
  await writeReferrals(referrals);

  console.log(`✅ Code de parrainage créé pour ${coachEmail}: ${code}`);
  console.log(`   → Réduction client: -${referral.discount}%`);
  console.log(`   → Commission coach: +${referral.commission}%`);

  return referral;
}

/**
 * Get referral by code
 */
export async function getReferralByCode(code: string): Promise<Referral | null> {
  const referrals = await readReferrals();
  return referrals.find((r) => r.code.toUpperCase() === code.toUpperCase() && r.isActive) || null;
}

/**
 * Apply referral code when a client subscribes
 */
export async function applyReferralCode(
  clientId: string,
  clientName: string,
  clientEmail: string,
  code: string,
  originalPrice: number
): Promise<{
  success: boolean;
  discount: number;
  discountedPrice: number;
  amountSaved: number;
  commission: number;
  referral?: Referral;
  error?: string;
}> {
  const referral = await getReferralByCode(code);

  if (!referral) {
    return {
      success: false,
      discount: 0,
      discountedPrice: originalPrice,
      amountSaved: 0,
      commission: 0,
      error: "Code de parrainage invalide ou inactif",
    };
  }

  // Check if client already used this code
  const alreadyUsed = referral.usedBy.some((u) => u.userId === clientId);
  if (alreadyUsed) {
    console.log(`⚠️  Code ${code} déjà utilisé par ${clientEmail}`);
    return {
      success: false,
      discount: 0,
      discountedPrice: originalPrice,
      amountSaved: 0,
      commission: 0,
      error: "Ce code a déjà été utilisé",
    };
  }

  // Calculate discount and commission
  const discountAmount = (originalPrice * referral.discount) / 100;
  const discountedPrice = originalPrice - discountAmount;
  const commissionAmount = (originalPrice * referral.commission) / 100;

  // Record usage
  const referrals = await readReferrals();
  const referralIndex = referrals.findIndex((r) => r.id === referral.id);

  if (referralIndex >= 0) {
    referrals[referralIndex].usedBy.push({
      userId: clientId,
      userName: clientName,
      userEmail: clientEmail,
      usedAt: new Date().toISOString(),
      amountSaved: discountAmount,
      commissionEarned: commissionAmount,
    });

    await writeReferrals(referrals);

    // Update coach commission balance in users.json
    const users = await readUsers();
    const coachIndex = users.findIndex((u) => u.id === referral.coachId);

    if (coachIndex >= 0) {
      if (!users[coachIndex].referralStats) {
        users[coachIndex].referralStats = {
          totalCommissions: 0,
          totalReferrals: 0,
        };
      }
      users[coachIndex].referralStats.totalCommissions += commissionAmount;
      users[coachIndex].referralStats.totalReferrals += 1;

      await writeUsers(users);

      console.log(`🎁 Code ${code} appliqué pour ${clientEmail}`);
      console.log(`   → Réduction client: -${discountAmount.toFixed(2)}€ (-${referral.discount}%)`);
      console.log(`   → Commission coach: +${commissionAmount.toFixed(2)}€ (+${referral.commission}%)`);
    }
  }

  return {
    success: true,
    discount: referral.discount,
    discountedPrice,
    amountSaved: discountAmount,
    commission: commissionAmount,
    referral: referrals[referralIndex],
  };
}

/**
 * Get all referrals for a coach
 */
export async function getCoachReferrals(coachId: string): Promise<Referral[]> {
  const referrals = await readReferrals();
  return referrals.filter((r) => r.coachId === coachId);
}

/**
 * Get referral stats for a coach
 */
export async function getCoachReferralStats(coachId: string): Promise<{
  totalClients: number;
  totalCommissions: number;
  totalSavings: number;
  activeCode: string | null;
  referrals: Referral[];
}> {
  const referrals = await getCoachReferrals(coachId);
  const activeReferral = referrals.find((r) => r.isActive);

  let totalClients = 0;
  let totalCommissions = 0;
  let totalSavings = 0;

  referrals.forEach((referral) => {
    totalClients += referral.usedBy.length;
    referral.usedBy.forEach((usage) => {
      totalCommissions += usage.commissionEarned;
      totalSavings += usage.amountSaved;
    });
  });

  return {
    totalClients,
    totalCommissions,
    totalSavings,
    activeCode: activeReferral?.code || null,
    referrals,
  };
}

/**
 * Get global referral stats (admin)
 */
export async function getReferralStats(): Promise<ReferralStats> {
  const referrals = await readReferrals();

  let totalUsages = 0;
  let totalCommissions = 0;
  let totalSavings = 0;

  referrals.forEach((referral) => {
    totalUsages += referral.usedBy.length;
    referral.usedBy.forEach((usage) => {
      totalCommissions += usage.commissionEarned;
      totalSavings += usage.amountSaved;
    });
  });

  return {
    totalCodes: referrals.length,
    totalUsages,
    totalCommissions,
    totalSavings,
  };
}

/**
 * Deactivate a referral code
 */
export async function deactivateReferralCode(code: string): Promise<boolean> {
  const referrals = await readReferrals();
  const index = referrals.findIndex((r) => r.code.toUpperCase() === code.toUpperCase());

  if (index >= 0) {
    referrals[index].isActive = false;
    await writeReferrals(referrals);
    console.log(`🚫 Code de parrainage désactivé: ${code}`);
    return true;
  }

  return false;
}

/**
 * Initialize referral system - create codes for all coaches
 */
export async function initializeReferralSystem(): Promise<void> {
  const users = await readUsers();
  const coaches = users.filter((u) => u.role === "coach");

  console.log(`\n🎁 Initialisation du système de parrainage...`);
  console.log(`   → ${coaches.length} coach(es) détecté(s)`);

  for (const coach of coaches) {
    try {
      await createReferralCode(
        coach.id,
        coach.fullName || coach.email,
        coach.email
      );
    } catch (error) {
      console.error(`Erreur lors de la création du code pour ${coach.email}:`, error);
    }
  }

  console.log(`✅ Système de parrainage initialisé\n`);
}

/**
 * Verify referral system on startup
 */
export async function verifyReferralSystem(): Promise<void> {
  await ensureDataFiles();
  const referrals = await readReferrals();

  console.log(`\n🎁 Vérification du système de parrainage...`);
  console.log(`   → ${referrals.length} code(s) de parrainage actif(s)`);

  const stats = await getReferralStats();
  console.log(`   → ${stats.totalUsages} utilisation(s)`);
  console.log(`   → ${stats.totalCommissions.toFixed(2)}€ de commissions`);
  console.log(`   → ${stats.totalSavings.toFixed(2)}€ de réductions clients`);
  console.log(`✅ Système de parrainage opérationnel\n`);
}

