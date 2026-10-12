import React, { useEffect } from 'react';

export interface NotificationState {
  type: 'success' | 'error';
  message: string;
}

interface NotificationProps {
  notification: NotificationState | null;
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({
  notification,
  onClose,
}) => {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <div className={`notification-banner ${notification.type}`}>
      <span className="notification-icon">
        {notification.type === 'success' ? '✅' : '⚠️'}
      </span>
      <span className="notification-message">{notification.message}</span>
      <button
        type="button"
        className="notification-close-btn"
        onClick={onClose}
        title="Dismiss message"
      >
        ✕
      </button>
    </div>
  );
};
