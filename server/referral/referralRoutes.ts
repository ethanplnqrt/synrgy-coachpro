import { Express, Request, Response } from 'express';
import {
  generateReferralCode,
  validateReferralCode,
  redeemReferralCode,
  getReferralsByOwner,
  getReferralsByInviter
} from './referralController';

export function registerReferralRoutes(app: Express) {
  // Créer un code d'invitation
  app.post('/api/referral/create', async (req: Request, res: Response) => {
    try {
      const { ownerId, ownerName, type } = req.body;

      if (!ownerId || !ownerName || !type) {
        return res.status(400).json({
          success: false,
          message: 'Données manquantes'
        });
      }

      if (!['coach', 'client'].includes(type)) {
        return res.status(400).json({
          success: false,
          message: 'Type invalide (coach ou client)'
        });
      }

      const referral = generateReferralCode(ownerId, ownerName, type);

      res.json({
        success: true,
        code: referral.code,
        link: `${req.protocol}://${req.get('host')}/register?ref=${referral.code}`,
        message: 'Code d\'invitation généré avec succès'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de la génération du code'
      });
    }
  });

  // Valider un code d'invitation (déjà existant, on l'améliore)
  app.get('/api/referral/validate', async (req: Request, res: Response) => {
    try {
      const code = req.query.code as string;

      if (!code) {
        return res.json({ valid: false, message: 'Code manquant' });
      }

      const referral = validateReferralCode(code);

      if (!referral) {
        return res.json({ valid: false, message: 'Code invalide ou expiré' });
      }

      res.json({
        valid: true,
        message: 'Code valide',
        inviterName: referral.ownerName,
        type: referral.type
      });
    } catch (error: any) {
      res.status(500).json({ valid: false, message: error.message });
    }
  });

  // Utiliser un code lors de l'inscription
  app.post('/api/referral/redeem', async (req: Request, res: Response) => {
    try {
      const { code, userId } = req.body;

      if (!code || !userId) {
        return res.status(400).json({
          success: false,
          message: 'Code ou utilisateur manquant'
        });
      }

      const success = redeemReferralCode(code, userId);

      if (!success) {
        return res.status(400).json({
          success: false,
          message: 'Code invalide ou déjà utilisé'
        });
      }

      res.json({
        success: true,
        message: 'Code utilisé avec succès'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  });

  // Liste des filleuls d'un utilisateur
  app.get('/api/referral/followers', async (req: Request, res: Response) => {
    try {
      const ownerId = req.query.ownerId as string;

      if (!ownerId) {
        return res.status(400).json({
          success: false,
          message: 'ID utilisateur manquant'
        });
      }

      const followers = getReferralsByInviter(ownerId);

      res.json({
        success: true,
        followers,
        count: followers.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  });

  // Liste des codes créés par un utilisateur
  app.get('/api/referral/codes', async (req: Request, res: Response) => {
    try {
      const ownerId = req.query.ownerId as string;

      if (!ownerId) {
        return res.status(400).json({
          success: false,
          message: 'ID utilisateur manquant'
        });
      }

      const codes = getReferralsByOwner(ownerId);

      res.json({
        success: true,
        codes
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  });
}
