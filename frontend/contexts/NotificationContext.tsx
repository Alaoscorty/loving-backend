import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number | false;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, type: Notification['type'], duration?: number | false) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (message: string, type: Notification['type'], duration?: number | false): void => {
      const id = Date.now().toString();
      const notification: Notification = { id, message, type, duration };

      setNotifications((prev) => [...prev, notification]);

      if (duration !== false) {
        const timeout = setTimeout(() => {
          removeNotification(id);
        }, (typeof duration === 'number' && duration > 0) ? duration : 3000);

        // don't return cleanup here; the provider's addNotification must match the
        // declared signature (returns void). The timeout will remove the notification.
        void timeout;
      }
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};
