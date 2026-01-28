export const validation = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  phone: (phone: string): boolean => {
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },

  password: (password: string): { valid: boolean; message?: string } => {
    if (password.length < 6) {
      return { valid: false, message: 'Le mot de passe doit contenir au moins 6 caractères' };
    }
    if (password.length > 50) {
      return { valid: false, message: 'Le mot de passe ne peut pas dépasser 50 caractères' };
    }
    return { valid: true };
  },

  required: (value: string): boolean => {
    return value.trim().length > 0;
  },
};
