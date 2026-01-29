import bcrypt from 'bcryptjs';
import { logger } from './logger';
import { User } from '../models/User.model';

export async function initializeDefaultAdmins() {
  try {

    const defaultAdmins = [
      {
        email: 'alaoscorty@gmail.com',
        password: '123456',
        firstName: 'Admin',
        lastName: 'Principal',
        role: 'admin',
      },
      {
        email: 'alaoservice1@gmail.com',
        password: '123456',
        firstName: 'Admin',
        lastName: 'Service 1',
        role: 'admin',
      },
      {
        email: 'alaoempire1@gmail.com',
        password: '123456',
        firstName: 'Admin',
        lastName: 'Empire',
        role: 'admin',
      },
    ];

    for (const adminData of defaultAdmins) {
      const existingAdmin = await User.findOne({ email: adminData.email });

      if (!existingAdmin) {
        // Hash du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.password, salt);

        const newAdmin = new User({
          email: adminData.email,
          password: hashedPassword,
          firstName: adminData.firstName,
          lastName: adminData.lastName,
          role: adminData.role,
          isVerified: true,
          status: 'active',
        });

        await newAdmin.save();
        logger.info(`✅ Compte admin créé: ${adminData.email}`);
      } else {
        logger.info(`ℹ️  Compte admin existe déjà: ${adminData.email}`);
      }
    }

    logger.info('✅ Initialisation des comptes admin terminée');
  } catch (error) {
    logger.error('❌ Erreur lors de l\'initialisation des comptes admin:', error);
  }
}
