import { Route, Routes } from "react-router-dom";
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import Home from "../pages/Home.jsx";
import Cart from "../pages/Cart.jsx";
import Menu from "../pages/Menu.jsx";
import Profile from "../pages/Profile.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Payment from "../pages/Payment.jsx";
import PaymentSuccess from "../pages/PaymentSuccess.jsx";
import OrderHistory from "../pages/OrderHistory.jsx";
import SocialLogin from "../pages/auth/SocialLogin.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />
      <Route path="/cart" element={<Cart />}></Route>
      <Route path="/menu" element={<Menu />}></Route>
      <Route path="/social-login" element={<SocialLogin />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/payment" element={<Payment />}></Route>
        <Route path="/paymentSuccess" element={<PaymentSuccess />}></Route>
        <Route path="/OrderHistory" element={<OrderHistory />}></Route>
      </Route>
    </Routes>
  );
}
