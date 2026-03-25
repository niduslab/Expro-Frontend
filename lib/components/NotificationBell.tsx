'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';

/**
 * Notification Bell Component
 * Displays notification icon with badge count
 * 
 * @param count - Number of unread notifications
 * @param onClick - Click handler
 * 
 * @example
 * <NotificationBell count={5} onClick={() => console.log('Clicked')} />
 */
interface NotificationBellProps {
  count?: number;
  onClick?: () => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ count = 0, onClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      aria-label="Notifications"
    >
      <Bell className="w-6 h-6" />
      {count > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
};
