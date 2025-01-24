import "./styles/LoadingSpinner.css";

const LoadingSpinner = ({ size = "medium", color = "primary" }) => {
  return (
    <div className={`loading-spinner-container ${size} ${color}`}>
      <div className="loading-spinner"></div>
    </div>
  );
};

export default LoadingSpinner;
