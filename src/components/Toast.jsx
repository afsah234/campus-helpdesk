import { IconCheckCircle, IconAlertCircle, IconX } from './Icons';

export function Toast({ toasts = [], onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        return (
          <div
            key={toast.id}
            className={`toast-item ${isError ? 'toast-error' : 'toast-success'}`}
          >
            <div className="toast-icon">
              {isError ? <IconAlertCircle size={18} /> : <IconCheckCircle size={18} />}
            </div>
            <div className="toast-text">{toast.message}</div>
            <button
              type="button"
              className="toast-close"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss message"
            >
              <IconX size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

