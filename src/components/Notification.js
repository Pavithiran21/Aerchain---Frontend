import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import './Notification.css';

const Notification = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      default:
        return <CheckCircle size={20} />;
    }
  };

  return (
    <div className={`notification notification-${type} ${isVisible ? 'show' : 'hide'}`}>
      <div className="notification-content">
        {getIcon()}
        <span>{message}</span>
      </div>
      <button className="notification-close" onClick={handleClose}>
        <X size={16} />
      </button>
    </div>
  );
};

export default Notification;