import { useEffect, useRef, useState } from "react";
import Loading from "./Loading";
import "../Styles/Payment.css";
import { Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const PaymentForm = ({ cartData, total }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const paymentInProgress = useRef(false);
  const [loadingMessage, setLoadingMessage] = useState("Preparing Payment...");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || paymentInProgress.current) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      return;
    }

    const token = localStorage.getItem("token");

    paymentInProgress.current = true;
    setPaymentLoading(true);
    setErrorMessage("");
    setIsError(false);
    setLoadingMessage("Preparing Payment...");
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/user/payment/intent",
        {
          amount: Math.round(total * 100),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );
      const clientSecret = response.data.clientSecret;

      // 2. Stripe payment
      setLoadingMessage("Processing Payment...");
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: document.getElementById("card-holder-name").value,
          },
        },
      });

      if (result.error) {
        console.log(result.error.message);

        setErrorMessage(result.error.message);
        setIsError(true);
        return;
      }

      // 3. Payment success
      if (result.paymentIntent?.status === "succeeded") {
        const orderItems = cartData.map((item) => ({
          name: item.name,
          price: Math.round(item.price * 100),
          quantity: item.quantity,
        }));

        // 4. Laravel → Order + Payment save
        setLoadingMessage("Securing your order...");
        await axios.post(
          "http://127.0.0.1:8000/api/user/payment/finalize",
          {
            payment_intent_id: result.paymentIntent.id,

            amount: Math.round(total * 100),

            cart: orderItems,

            address: address,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          },
        );

        localStorage.removeItem("cart");

        navigate("/paymentSuccess");
      } else {
        setIsError(true);
        setErrorMessage("Payment has not completed. Please check its status before trying again.");
      }
    } catch (error) {
      console.log(error);
      setIsError(true);

      setErrorMessage(
        error.response?.data?.message || "Payment failed. Please try again.",
      );
    } finally {
      paymentInProgress.current = false;
      setPaymentLoading(false);
    }
  };

  return (
    <>
      {paymentLoading && <Loading message={loadingMessage} />}

      <form id="payment-form" className="payment-grid" onSubmit={handleSubmit} aria-busy={paymentLoading}>
        <label>
          Cardholder name
          <input
            id="card-holder-name"
            type="text"
            placeholder="Alex Morgan"
            required
          />
        </label>

        <label>
          Shipping address
          <input
            id="shipping-address"
            type="text"
            placeholder="123 Main St, Apt 4"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>

        <div
          className="test-card-hint"
          style={{
            padding: "14px 16px",
            border: isError
              ? "1px solid #d32f2f"
              : "1px solid rgba(36,36,33,0.15)",
            borderRadius: "12px",
            background: "#fff",
          }}
        >
          <strong>Test card:</strong> 4242 4242 4242 4242
        </div>

        <label>
          Card details
          <div
            style={{
              padding: "14px 16px",
              border: "1px solid rgba(36,36,33,0.15)",
              borderRadius: "12px",
              background: "#fff",
            }}
          >
            <CardElement
              onChange={(event) => {
                if (event.error) {
                  setIsError(true);
                  setErrorMessage(event.error.message);
                } else {
                  setIsError(false);
                  setErrorMessage("");
                }
              }}
              options={{
                style: {
                  base: {
                    color: "#111827",
                    fontFamily: "sans-serif",
                    fontSmoothing: "antialiased",
                    fontSize: "16px",

                    "::placeholder": {
                      color: "#9ca3af",
                    },
                  },

                  invalid: {
                    color: "#d32f2f",
                  },
                },
              }}
            />
          </div>
        </label>

        {errorMessage && <p role="alert">{errorMessage}</p>}

        <button
          className="pay-btn"
          type="submit"
          disabled={!stripe || !elements || paymentLoading}
        >
          {paymentLoading ? "Processing..." : "Pay now"}
        </button>
      </form>
    </>
  );
};

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
