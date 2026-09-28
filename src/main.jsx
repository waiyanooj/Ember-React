import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import Login from "./Authentication/login.jsx";
import Register from "./Authentication/Register.jsx";
import Home from "./Dashboard/home.jsx";
import Cart from "./Dashboard/Cart.jsx";
import Menu from "./Dashboard/Menu.jsx";
import Profile from "./Dashboard/Profile.jsx";
import Middleware from "./Dashboard/MiddleWare/Middleware.jsx";
import Payment from "./Dashboard/Payment.jsx";
import PaymentSuccess from "./Dashboard/PaymentSuccess.jsx";
import OrderHistory from "./Dashboard/OrderHistory.jsx";
import SocialLogin from "./Authentication/SocialLogin.jsx";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />
      <Route path="/cart" element={<Cart />}></Route>
      <Route path="/menu" element={<Menu />}></Route>
      <Route path="/social-login" element={<SocialLogin />} />
      <Route element={<Middleware />}>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/payment" element={<Payment />}></Route>
        <Route path="/paymentSuccess" element={<PaymentSuccess />}></Route>
        <Route path="/OrderHistory" element={<OrderHistory />}></Route>
      </Route>
    </Routes>
  </BrowserRouter>
);
