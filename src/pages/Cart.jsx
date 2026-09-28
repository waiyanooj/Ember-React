import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/style.css";
import "../styles/Cart.css";

const Cart = () => {
  const [cart, setCart] = useState(() => {
    const showCart = localStorage.getItem("cart");

    return showCart ? JSON.parse(showCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const money = (value) => `$${value.toFixed(2)}`;

  const removeItem = (index) => {
    setCart((prevCart) => {
      return prevCart.filter((_, i) => i !== index);
    });
  };

  const changeQuantity = (index, amount) => {
    setCart((prevCart) =>
      prevCart
        .map((item, i) =>
          i === index ? { ...item, quantity: item.quantity + amount } : item,
        )
        .filter((item) => item.quantity >= 1),
    );
  };

  const subTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const fee = subTotal ? 0.5 : 0;

  const total = subTotal + fee;

  return (
    <>
      <main>
        <header className="site-header">
          <a
            className="brand"
            href="index.html"
            aria-label="Ember and Bean home"
          >
            <span className="brand-mark">e</span>
            <span>
              EMBER
              <br />
              &amp; BEAN
            </span>
          </a>
          <Link className="text-link" to="/menu">
            ← Continue browsing
          </Link>
        </header>
        <main className="cart-main">
          <div className="cart-header">
            <div>
              <p className="eyebrow">
                <span></span> ORDER AHEAD
              </p>
              <h1>
                Your <em>order.</em>
              </h1>
            </div>
            <p>
              Pick up at Ember &amp; Bean
              <br />
              Ready in 10–15 minutes
            </p>
          </div>
          <div className="cart-layout">
            <section className="cart-items" aria-live="polite">
              {cart.length > 0 ? (
                cart.map((item, index) => (
                  <article className="cart-item" key={`${item.name}-${index}`}>
                    <div className="cart-item-main">
                      <div className="cart-item-copy">
                        <p className="cart-item-label">Signature order</p>

                        <h3>{item.name}</h3>

                        <p>Made fresh, just for you</p>
                      </div>

                      <strong className="cart-item-price">
                        {money(item.price * item.quantity)}
                      </strong>
                    </div>

                    <div className="cart-item-actions">
                      <button
                        className="remove-item"
                        onClick={() => removeItem(index)}
                      >
                        Remove
                      </button>

                      <div className="quantity-control">
                        <button
                          onClick={() => changeQuantity(index, -1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          onClick={() => changeQuantity(index, 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="empty-cart">
                  <h2>Your cup is waiting.</h2>

                  <p>
                    Your order is empty. Choose something delicious from our
                    menu.
                  </p>

                  <Link className="dark-button" to="/menu">
                    Browse the menu <span>→</span>
                  </Link>
                </div>
              )}
            </section>
            <aside className="order-summary">
              <p className="eyebrow">
                <span></span> ORDER SUMMARY
              </p>
              <h2>
                Nearly
                <br />
                <em>there.</em>
              </h2>
              <div className="summary-line-cart">
                <span>Subtotal</span>
                <strong className="subtotal"> {money(subTotal)}</strong>
              </div>
              <div className="summary-line-cart">
                <span>Service fee</span>
                <strong className="fee"> {money(fee)}</strong>
              </div>
              <div className="summary-line-cart total">
                <span>Total</span>
                <strong className="total"> {money(total)}</strong>
              </div>
              <Link className="checkout-button" to="/payment">
                Place order →
              </Link>
              <p className="summary-note">
                Demo checkout only. No payment will be taken.
              </p>
              <div className="confirmation">
                Your order is confirmed. We’ll have it ready soon — thank you!
              </div>
            </aside>
          </div>
        </main>
      </main>
    </>
  );
};

export default Cart;
