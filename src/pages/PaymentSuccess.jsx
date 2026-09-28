import "../styles/Success.css";
import { Link } from "react-router-dom";

const PaymentSuccess = () => {
  return (
    <>
      <div className="success-shell">
        <div className="success-icon">
          <span className="success-check">✓</span>
        </div>
        <h1>Payment confirmed</h1>
        <p>
          Your order is complete. We’ve received your payment and are preparing
          your items now.
        </p>
        <Link to="/menu">Continue shopping</Link>
      </div>
    </>
  );
};

export default PaymentSuccess;
