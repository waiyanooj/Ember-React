import PaymentForm from "../components/payment/PaymentForm.jsx";
import { useEffect, useState } from "react";
import "../styles/Payment.css";
import { Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const Payment = () => {
  const [cartData] = useState(() => {
    const cartItem = localStorage.getItem("cart");

    return cartItem ? JSON.parse(cartItem) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartData));
  }, [cartData]);

  const subtotal = cartData.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const deliveryFee = cartData.length > 0 ? 0.5 : 0;

  const total = subtotal + deliveryFee;

  return (
    <Elements stripe={stripePromise}>
      <div className="payment-shell">
        <div className="back">
          <p className="back-b">
            <span></span>

            <Link to="/cart">
              <iconify-icon
                icon="mingcute:arrow-left-fill"
                width="24"
                height="24"
              ></iconify-icon>
              Back to Home
            </Link>
          </p>
        </div>

        <section className="payment-card">
          <p className="eyebrow">
            <span></span>
            SECURE CHECKOUT
          </p>

          <h1 className="payment-title">Payment details</h1>

          <p className="payment-subtext">
            Complete your order with a strict, secure checkout experience.
          </p>

          <div className="payment-methods">
            <button className="active" type="button">
              Card
            </button>

            <button type="button">PayPal</button>

            <button type="button">Cash</button>
          </div>

          <PaymentForm cartData={cartData} total={total} />
        </section>

        <aside className="payment-summary">
          <p className="eyebrow">
            <span></span>
            ORDER REVIEW
          </p>

          <h2>Almost done.</h2>

          <div className="summary-line">
            <span>Subtotal</span>

            <strong>${subtotal.toFixed(2)}</strong>
          </div>

          <div className="summary-line">
            <span>Service fee</span>

            <strong>${deliveryFee.toFixed(2)}</strong>
          </div>

          <div className="summary-line total">
            <span>Total</span>

            <strong>${total.toFixed(2)}</strong>
          </div>
        </aside>
      </div>
    </Elements>
  );
};

export default Payment;
