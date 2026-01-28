export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(\+33|0)[1-9](?:[0-9]{8})$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export const validateAge = (age: number, minAge: number = 18, maxAge: number = 120): boolean => {
  return age >= minAge && age <= maxAge;
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

export const validateNumber = (value: string): boolean => {
  return /^\d+(\.\d{1,2})?$/.test(value);
};

export const validatePriceRange = (min: number, max: number): boolean => {
  return min > 0 && max > min;
};

export interface FormErrors {
  [key: string]: string;
}

export const validateForm = (
  formData: { [key: string]: any },
  rules: { [key: string]: ((value: any) => boolean | string)[] }
): FormErrors => {
  const errors: FormErrors = {};

  Object.keys(rules).forEach((field) => {
    const validators = rules[field];

    for (const validator of validators) {
      const result = validator(formData[field]);

      if (result !== true) {
        errors[field] = result as string;
        break;
      }
    }
  });

  return errors;
};
