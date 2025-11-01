import { v4 as uuidv4 } from 'uuid';

export interface ReferralCode {
  id: string;
  code: string;
  type: 'coach' | 'client';
  ownerId: string;
  ownerName: string;
  invitedUserId?: string;
  createdAt: Date;
  redeemedAt?: Date;
  status: 'active' | 'used' | 'expired';
}

// Mock database pour la démo
const referralCodes: ReferralCode[] = [];

/**
 * Génère un code d'invitation unique
 */
export function generateReferralCode(
  ownerId: string,
  ownerName: string,
  type: 'coach' | 'client'
): ReferralCode {
  // Génère un code alphanumérique de 8 caractères
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  const referral: ReferralCode = {
    id: uuidv4(),
    code,
    type,
    ownerId,
    ownerName,
    createdAt: new Date(),
    status: 'active'
  };

  referralCodes.push(referral);
  return referral;
}

/**
 * Valide un code d'invitation
 */
export function validateReferralCode(code: string): ReferralCode | null {
  const referral = referralCodes.find(
    ref => ref.code === code && ref.status === 'active'
  );

  if (!referral) {
    return null;
  }

  return referral;
}

/**
 * Marque un code comme utilisé
 */
export function redeemReferralCode(
  code: string,
  invitedUserId: string
): boolean {
  const referral = referralCodes.find(ref => ref.code === code);

  if (!referral || referral.status !== 'active') {
    return false;
  }

  referral.invitedUserId = invitedUserId;
  referral.redeemedAt = new Date();
  referral.status = 'used';

  return true;
}

/**
 * Récupère tous les codes d'un utilisateur
 */
export function getReferralsByOwner(ownerId: string): ReferralCode[] {
  return referralCodes.filter(ref => ref.ownerId === ownerId);
}

/**
 * Récupère tous les filleuls d'un utilisateur
 */
export function getReferralsByInviter(inviterId: string): Array<{
  code: string;
  userName: string;
  registeredAt: Date;
  status: 'active' | 'inactive';
}> {
  const redeemed = referralCodes.filter(
    ref => ref.ownerId === inviterId && ref.status === 'used'
  );

  return redeemed.map(ref => ({
    code: ref.code,
    userName: `User ${ref.invitedUserId}`,
    registeredAt: ref.redeemedAt || ref.createdAt,
    status: 'active' // En production, vérifier l'activité réelle
  }));
}
