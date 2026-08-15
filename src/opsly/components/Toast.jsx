import { useState, useEffect } from 'react';
import { FiX, FiCheckCircle, FiAlertTriangle, FiAlertCircle, FiInfo } from 'react-icons/fi';

// Singleton event dispatcher for toasts
export const toast = (message, type = 'success') => {
  const event = new CustomEvent('opsly-toast', {
    detail: { id: Math.random().toString(36).substring(2, 9), message, type }
  });
  window.dispatchEvent(event);
};

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const { id, message, type } = e.detail;
      setToasts((prev) => [...prev, { id, message, type }]);

      // Auto dismiss after 4 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };

    window.addEventListener('opsly-toast', handleToast);
    return () => window.removeEventListener('opsly-toast', handleToast);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle color="var(--opsly-success)" size={18} />;
      case 'warning':
        return <FiAlertTriangle color="var(--opsly-warning)" size={18} />;
      case 'error':
        return <FiAlertCircle color="var(--opsly-danger)" size={18} />;
      default:
        return <FiInfo color="var(--opsly-info)" size={18} />;
    }
  };

  return (
    <div className="opsly-toast-container">
      {toasts.map((t) => (
        <div key={t.id} className="opsly-toast">
          <div className="opsly-toast-icon">{getIcon(t.type)}</div>
          <div className="opsly-toast-content">{t.message}</div>
          <button className="opsly-toast-close" onClick={() => removeToast(t.id)}>
            <FiX size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
export default ToastContainer;
