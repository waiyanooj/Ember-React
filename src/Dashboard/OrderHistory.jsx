import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/OrderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/user/order/history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      console.log(response.data);

      setOrders(response.data.orderHistory || []);
    } catch (error) {
      console.log("Order History Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatMoney = (value) => {
    return `$${Number(value).toFixed(2)}`;
  };

  //   if (loading) {
  //     return <div className="order-loading">Loading orders...</div>;
  //   }

  return (
    <div className="history-page">
      <header className="site-header">
        <div className="brand">
          <span className="brand-mark">e</span>

          <span>
            EMBER
            <br />
            &amp; BEAN
          </span>
        </div>

        <a className="text-link" href="/profile">
          ← Continue browsing
        </a>
      </header>

      <main className="history-main">
        <div className="history-header">
          <div>
            <p className="eyebrow">
              <span></span> ORDER HISTORY
            </p>

            <h1>
              All of your <em>past orders.</em>
            </h1>
          </div>

          <p>Review your completed orders anytime.</p>
        </div>

        <section className="history-list">
          {!orders.length ? (
            <div className="empty-history">
              <h2>No order history yet.</h2>

              <p>Place an order from the menu to see it listed here.</p>

              <a className="dark-button" href="/cart">
                View your order <span>→</span>
              </a>
            </div>
          ) : (
            orders.map((order,index) => (
              <article className="history-card" key={`${order.id}-${index}`}>
                <div className="history-card-header">
                  <div>
                    <p className="eyebrow">Order placed</p>

                    <h2>{formatDate(order.created_at)}</h2>
                  </div>

                  <div className="history-total">
                    {formatMoney(order.total_price / 100)}
                  </div>
                </div>

                <div className="history-items">
                  <div className="history-item">
                    <div>
                      <strong>{order.description}</strong>

                      <p>
                        {order.quantity} ×{" "}
                        {formatMoney(order.total_price / 100)}
                      </p>
                    </div>

                    <span
                      style={{
                        color: order.order_status === "confirm" ? "green" : order.order_status === "reject" ? "red" : 'yellow',
                      }}
                    >
                      {order.order_status}
                    </span>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
};

export default OrderHistory;
