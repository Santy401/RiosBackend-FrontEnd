import PropTypes from "prop-types";
import "./styles/ConfirmModal.css";

const ConfirmModal = ({ message, onConfirm, onCancel, isLoading }) => {
  return (
    <div className="confirm-modal-backdrop">
      <div className="confirm-modal">
        <p className="confirm-message">{message}</p>
        <div className="confirm-buttons">
          <button 
            className="confirm-button confirm"
            onClick={onConfirm} 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                Eliminando...
              </>
            ) : (
              "Confirmar"
            )}
          </button>
          <button 
            className="confirm-button cancel"
            onClick={onCancel} 
            disabled={isLoading}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmModal.propTypes = {
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default ConfirmModal;
