import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { listProfiles, getProfileById } from '../controllers/profiles.controller';

const router = express.Router();

// Liste des profils provider (utilisateurs authentifiés)
router.get('/', authenticate, listProfiles);

// Détail d'un profil
router.get('/:id', authenticate, getProfileById);

export default router;
