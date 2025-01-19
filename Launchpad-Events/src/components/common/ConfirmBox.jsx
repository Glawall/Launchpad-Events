export default function ConfirmBox({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <div className="btn-group">
          <button onClick={onClose} className="btn-red">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn-blue">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
