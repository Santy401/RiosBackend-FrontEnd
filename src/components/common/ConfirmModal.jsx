import PropTypes from "prop-types";
import "../styles/ConfirmModal.css";
import { motion } from "framer-motion"

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirm-modal-backdrop">
      <motion.div
        initial={{ opacity: 0, scale: .1 }}
        animate={{ opacity: 1, scale: 1 }}
        className="confirm-modal">
        <p className="confirm-message">{message}</p>
        <div className="confirm-buttons">
          <motion.button
            initial={{ opacity: 0, scale: .8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1, boxShadow: "0px 4px 12px rgba(0,0,0,0.15)" }}
            whileTap={{ scale: 0.8 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="confirm-button confirm"
            onClick={onConfirm}
          >
            Eliminar
          </motion.button>
          <motion.button
            initial={{ opacity: 0, scale: .8}}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1, boxShadow: "0px 4px 12px rgba(0,0,0,0.15)" }}
            whileTap={{ scale: 0.8 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="confirm-button cancel"
            onClick={onCancel}
          >
            Cancelar
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

ConfirmModal.propTypes = {
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmModal;
