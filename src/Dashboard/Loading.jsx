import { createPortal } from 'react-dom';
import '../Styles/Loading.css';

function Loading({ message = "Processing..." }) {
  return createPortal(
    <div className="loading-modal">
      <div className="loading-backdrop" aria-hidden="true"></div>

      <div className="loading-panel" role="status" aria-live="polite" aria-atomic="true">
        <div className="loading-spinner" aria-hidden="true"></div>

        <p className="loading-message">
          {message}
        </p>

        <p className="loading-subtext">
          Please wait...
        </p>
      </div>
    </div>,
    document.body,
  );
}

export default Loading;
