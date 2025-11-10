import { Router } from "express";
import { authenticate, type AuthenticatedRequest } from "../auth/authMiddleware.js";
import {
  createReferralCode,
  getReferralByCode,
  getCoachReferrals,
  getCoachReferralStats,
  getReferralStats,
  applyReferralCode,
  deactivateReferralCode,
  initializeReferralSystem,
} from "../services/referralService.js";

const router = Router();

/**
 * GET /api/referrals/my
 * Get current user's referral code and stats (coach only)
 */
router.get("/my", authenticate, async (req: AuthenticatedRequest, res) => {
  const user = req.user!;

  // Only coaches can have referral codes
  if (user.role !== "coach") {
    return res.status(403).json({
      success: false,
      error: "Seuls les coachs peuvent avoir des codes de parrainage",
    });
  }

  try {
    const stats = await getCoachReferralStats(user.id);

    // Create code if doesn't exist
    if (!stats.activeCode) {
      const referral = await createReferralCode(
        user.id,
        user.fullName || user.email,
        user.email
      );
      stats.activeCode = referral.code;
    }

    return res.json({
      success: true,
      code: stats.activeCode,
      stats: {
        totalClients: stats.totalClients,
        totalCommissions: stats.totalCommissions,
        totalSavings: stats.totalSavings,
      },
      referrals: stats.referrals.map((r) => ({
        code: r.code,
        discount: r.discount,
        commission: r.commission,
        usageCount: r.usedBy.length,
        isActive: r.isActive,
        createdAt: r.createdAt,
      })),
    });
  } catch (error: any) {
    console.error("Error fetching referral stats:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch referral stats",
    });
  }
});

/**
 * GET /api/referrals/coach/:coachId
 * Get referral info for a specific coach
 */
router.get("/coach/:coachId", authenticate, async (req: AuthenticatedRequest, res) => {
  const { coachId } = req.params;
  const currentUser = req.user!;

  // Authorization: user can see their own stats, or admin can see any
  if (currentUser.id !== coachId && currentUser.role !== "coach") {
    return res.status(403).json({
      success: false,
      error: "Unauthorized",
    });
  }

  try {
    const referrals = await getCoachReferrals(coachId);

    if (referrals.length === 0) {
      return res.json({
        success: true,
        message: "No referral codes found for this coach",
        referrals: [],
      });
    }

    return res.json({
      success: true,
      referrals: referrals.map((r) => ({
        id: r.id,
        code: r.code,
        discount: r.discount,
        commission: r.commission,
        isActive: r.isActive,
        createdAt: r.createdAt,
        usedBy: r.usedBy.map((u) => ({
          userName: u.userName,
          userEmail: u.userEmail,
          usedAt: u.usedAt,
          amountSaved: u.amountSaved,
          commissionEarned: u.commissionEarned,
        })),
      })),
    });
  } catch (error: any) {
    console.error("Error fetching coach referrals:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch referrals",
    });
  }
});

/**
 * POST /api/referrals/validate
 * Validate a referral code before checkout
 */
router.post("/validate", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({
      success: false,
      error: "Code de parrainage requis",
    });
  }

  try {
    const referral = await getReferralByCode(code);

    if (!referral) {
      return res.json({
        success: false,
        valid: false,
        error: "Code de parrainage invalide ou inactif",
      });
    }

    return res.json({
      success: true,
      valid: true,
      discount: referral.discount,
      coachName: referral.coachName,
      message: `Code valide ! Vous bénéficierez de -${referral.discount}% sur votre abonnement`,
    });
  } catch (error: any) {
    console.error("Error validating referral code:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to validate code",
    });
  }
});

/**
 * POST /api/referrals/apply
 * Apply a referral code (internal use, called during checkout)
 */
router.post("/apply", authenticate, async (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const { code, originalPrice } = req.body;

  if (!code || !originalPrice) {
    return res.status(400).json({
      success: false,
      error: "Code et prix requis",
    });
  }

  try {
    const result = await applyReferralCode(
      user.id,
      user.fullName || user.email,
      user.email,
      code,
      originalPrice
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.json(result);
  } catch (error: any) {
    console.error("Error applying referral code:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to apply code",
    });
  }
});

/**
 * POST /api/referrals/create
 * Create a referral code (coach only)
 */
router.post("/create", authenticate, async (req: AuthenticatedRequest, res) => {
  const user = req.user!;

  if (user.role !== "coach") {
    return res.status(403).json({
      success: false,
      error: "Seuls les coachs peuvent créer des codes de parrainage",
    });
  }

  try {
    const referral = await createReferralCode(
      user.id,
      user.fullName || user.email,
      user.email
    );

    return res.json({
      success: true,
      referral: {
        code: referral.code,
        discount: referral.discount,
        commission: referral.commission,
        createdAt: referral.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Error creating referral code:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to create code",
    });
  }
});

/**
 * POST /api/referrals/deactivate
 * Deactivate a referral code (coach only)
 */
router.post("/deactivate", authenticate, async (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const { code } = req.body;

  if (user.role !== "coach") {
    return res.status(403).json({
      success: false,
      error: "Unauthorized",
    });
  }

  if (!code) {
    return res.status(400).json({
      success: false,
      error: "Code requis",
    });
  }

  try {
    const success = await deactivateReferralCode(code);

    if (!success) {
      return res.status(404).json({
        success: false,
        error: "Code non trouvé",
      });
    }

    return res.json({
      success: true,
      message: "Code désactivé avec succès",
    });
  } catch (error: any) {
    console.error("Error deactivating referral code:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to deactivate code",
    });
  }
});

/**
 * GET /api/referrals/stats
 * Get global referral stats (admin/coach only)
 */
router.get("/stats", authenticate, async (req: AuthenticatedRequest, res) => {
  const user = req.user!;

  if (user.role !== "coach") {
    return res.status(403).json({
      success: false,
      error: "Unauthorized",
    });
  }

  try {
    const stats = await getReferralStats();

    return res.json({
      success: true,
      stats: {
        totalCodes: stats.totalCodes,
        totalUsages: stats.totalUsages,
        totalCommissions: stats.totalCommissions,
        totalSavings: stats.totalSavings,
      },
    });
  } catch (error: any) {
    console.error("Error fetching referral stats:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch stats",
    });
  }
});

/**
 * POST /api/referrals/initialize
 * Initialize referral system (create codes for all coaches)
 * Admin only
 */
router.post("/initialize", authenticate, async (req: AuthenticatedRequest, res) => {
  const user = req.user!;

  if (user.role !== "coach") {
    return res.status(403).json({
      success: false,
      error: "Unauthorized - Admin only",
    });
  }

  try {
    await initializeReferralSystem();

    return res.json({
      success: true,
      message: "Referral system initialized successfully",
    });
  } catch (error: any) {
    console.error("Error initializing referral system:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to initialize system",
    });
  }
});

export default router;

