import nodemailer from 'nodemailer';
import { logger } from './logger';

const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587');
const EMAIL_USER = process.env.EMAIL_USER || '';
const EMAIL_PASS = process.env.EMAIL_PASS || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@loving.app';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8081';

// Créer le transporteur email
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_PORT === 465,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Vérifier la configuration email au démarrage
if (EMAIL_USER && EMAIL_PASS) {
  transporter.verify((error) => {
    if (error) {
      logger.warn('Configuration email invalide:', error);
    } else {
      logger.info('✅ Configuration email validée');
    }
  });
}

export const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
  if (!EMAIL_USER || !EMAIL_PASS) {
    logger.warn('Email non configuré, email de vérification non envoyé');
    return;
  }

  const verificationUrl = `${FRONTEND_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Loving" <${EMAIL_FROM}>`,
    to: email,
    subject: 'Vérification de votre email - Loving',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Bienvenue sur Loving</h2>
        <p>Merci de vous être inscrit sur notre plateforme d'accompagnement social et événementiel.</p>
        <p>Veuillez cliquer sur le lien ci-dessous pour vérifier votre adresse email :</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">
          Vérifier mon email
        </a>
        <p>Ou copiez ce lien dans votre navigateur :</p>
        <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          Ce lien expire dans 24 heures.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Email de vérification envoyé à ${email}`);
  } catch (error) {
    logger.error('Erreur lors de l\'envoi de l\'email de vérification:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email: string, token: string): Promise<void> => {
  if (!EMAIL_USER || !EMAIL_PASS) {
    logger.warn('Email non configuré, email de réinitialisation non envoyé');
    return;
  }

  const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"Loving" <${EMAIL_FROM}>`,
    to: email,
    subject: 'Réinitialisation de votre mot de passe - Loving',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Réinitialisation de mot de passe</h2>
        <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
        <p>Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">
          Réinitialiser mon mot de passe
        </a>
        <p>Ou copiez ce lien dans votre navigateur :</p>
        <p style="color: #666; word-break: break-all;">${resetUrl}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          Ce lien expire dans 1 heure.
        </p>
        <p style="color: #999; font-size: 12px;">
          Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Email de réinitialisation envoyé à ${email}`);
  } catch (error) {
    logger.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', error);
    throw error;
  }
};
