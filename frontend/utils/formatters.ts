import { format, formatDistance, isToday, isYesterday } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatDate = (date: string | Date, formatStr: string = 'dd/MM/yyyy') => {
  return format(new Date(date), formatStr, { locale: fr });
};

export const formatDateTime = (date: string | Date) => {
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: fr });
};

export const formatRelativeTime = (date: string | Date) => {
  const dateObj = new Date(date);
  
  if (isToday(dateObj)) {
    return format(dateObj, 'HH:mm', { locale: fr });
  }
  
  if (isYesterday(dateObj)) {
    return 'Hier';
  }
  
  return formatDistance(dateObj, new Date(), {
    addSuffix: true,
    locale: fr,
  });
};

export const formatCurrency = (amount: number, currency: string = 'EUR') => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(amount);
};

// Formate un nombre avec séparateurs de milliers
export const formatNumber = (value: number) => {
  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatPrice = (price: number) => {
  return `${price.toFixed(2)}€`;
};

export const formatPhoneNumber = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
  }
  return phone;
};

export const formatTimeRange = (startDate: string | Date, endDate: string | Date) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startStr = format(start, 'HH:mm', { locale: fr });
  const endStr = format(end, 'HH:mm', { locale: fr });
  
  return `${startStr} - ${endStr}`;
};

export const formatDateRange = (startDate: string | Date, endDate: string | Date) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startStr = format(start, 'd MMM', { locale: fr });
  const endStr = format(end, 'd MMM yyyy', { locale: fr });
  
  return `${startStr} au ${endStr}`;
};

export const getDayName = (date: string | Date) => {
  return format(new Date(date), 'EEEE', { locale: fr });
};

export const getMonthName = (date: string | Date) => {
  return format(new Date(date), 'MMMM', { locale: fr });
};
