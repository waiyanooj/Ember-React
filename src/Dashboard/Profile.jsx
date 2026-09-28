import React, { useState, useEffect, useRef } from "react";

import "../Styles/Profile.css";
import styled from "styled-components";
import { Link } from "react-router-dom";
import axios from "axios";
import Loading from "./Loading";

const ErrorMessage = styled.div`
  color: ${(props) => (props.isError || props.isEmail ? "rgb(255, 0, 0)" : "")};

  background-color: ${(props) =>
    props.isError || props.isEmail ? "rgba(206, 30, 30, 0.31)" : ""};

  height: ${(props) => (props.isError || props.isEmail ? "40px" : "")};

  display: ${(props) => (props.isError || props.isEmail ? "flex" : "")};

  align-items: ${(props) => (props.isError || props.isEmail ? "center" : "")};

  justify-content: ${(props) =>
    props.isError || props.isEmail ? "center" : ""};

  border-radius: ${(props) => (props.isError || props.isEmail ? "10px" : "")};

  border: ${(props) => (props.isError || props.isEmail ? "1px solid red" : "")};
`;

const Profile = () => {
  const fontStyle = {
    fontSize: "50px",
    marginTop: "10px",
  };

  // --------------------------------
  // Validation
  // --------------------------------
  const [validate, setValidate] = useState("");
  const [email, setEmail] = useState("");

  const validateStyle = {
    height: "50px",
  };

  const isError = /\d/.test(validate);

  const isEmail = email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // --------------------------------
  // Input Change
  // --------------------------------
  const handleProfile = async (e) => {
    const { name, value } = e.target;

    // Name validation
    if (name === "name") {
      setValidate(value);
    }

    // Email validation
    if (name === "email") {
      setEmail(value);
    }

    // Profile data update
    setUsersData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  ////////////////////////////////////////////
  const [saveItem, getSaveItem] = useState(() => {
    const saveItemData = localStorage.getItem("saveProfile");

    return saveItemData ? JSON.parse(saveItemData) : [];
  });

  useEffect(() => {
    localStorage.setItem("saveProfile", JSON.stringify(saveItem));
  }, [saveItem]);

  console.log(saveItem);

  const saveCartStyle = {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    padding: "12px",
    border: "1px solid var(--line)",
    borderRadius: "10px",
    marginBottom: "10px",
    background: "#fff",
  };

  const saveBox = {
    width: "72px",
    height: "72px",
    objectFit: "cover",
    borderRadius: "8px",
  };

  const ProSuc = {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "lightgreen",
    border: "1px solid green",
    color: "white",
    borderRadius: "10px",
    fontSize: "14px",
  };

  const [profileSuccess, setProfileSuccess] = useState(false);
  const successToastTimer = useRef(null);
  // Save List Process data from Menu Page in Profile

  const [saveCart, setSaveCart] = useState(() => {
    const saveCartItem = localStorage.getItem("cart");

    return saveCartItem ? JSON.parse(saveCartItem) : [];
  });

  // Update LocalStorage

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(saveCart));
  }, [saveCart]);

  // Cart Process + -
  const handleAddCart = (e) => {
    const cartName = e.currentTarget.dataset.name;
    const cartPrice = Number(e.currentTarget.dataset.price);

    setSaveCart((preventCart) => {
      const cartAddItem = preventCart.find((item) => item.name === cartName);

      if (cartAddItem) {
        return preventCart.map((item) =>
          item.name === cartName
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [
        ...preventCart,
        {
          name: cartName,
          price: cartPrice,
          quantity: 1,
        },
      ];
    });
  };

  // Cart Process for Remove Button

  const handleRemoveCart = (e) => {
    const removeName = e.currentTarget.dataset.name;

    getSaveItem((preventCart) => {
      const newCart = preventCart.filter((item) => item.name !== removeName);
      return newCart;
    });
  };

  // Cart Count

  const cartCount = saveCart.reduce((total, item) => total + item.quantity, 0);
  const getProductQuantity = (productName) => {
    const item = saveCart.find((item) => item.name === productName);
    return item ? item.quantity : 0;
  };

  // Profile Data

  const [usersData, setUsersData] = useState({});

  const handleProfileData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/user/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );
      setUsersData(response.data.user);
      console.log("PROFILE:", response.data);
      setName(response.data.user.name);
      setEmailInput(response.data.user.email);
      setProfileImage(response.data.profileImg);
    } catch (e) {
      console.log(e.response?.data || e);
    }
  };

  useEffect(() => {
    handleProfileData();
  }, []);

  // Profle Update Data with APIs

  const [name, setName] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [profileImg, setProfileImage] = useState(null);

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setProfileImage(file);
  };

  const userDataUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", emailInput);
      formData.append("_method", "PUT");

      if (profileImg) {
        formData.append("profileImg", profileImg);
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/api/user/profile/update",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      console.log(response.data);
      setUsersData(response.data.user);
      setProfileSuccess(true);
      clearTimeout(successToastTimer.current);
      successToastTimer.current = setTimeout(() => {
        setProfileSuccess(false);
      }, 4000);
    } catch (e) {
      console.log(e.response?.data);
    }
  };

  const [userOldData, setUserOldData] = useState(() => {
    const saveData = localStorage.getItem("userData");

    return saveData ? JSON.parse(saveData) : null;
  });

  const handleLogout = async (e) => {
    e.preventDefault();

    // const token = localStorage.getItem("token");

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://127.0.0.1:8000/api/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      localStorage.removeItem("token");
      localStorage.removeItem("userData");

      setUserOldData(null);
      window.location.href = "/";
    } catch (error) {
      console.log(error);
    }
  };

  const [changePasss, setChangePass] = useState(false);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passwordSuccess, setPassSuccess] = useState(false);
  const [ShowPassword, setShowPassword] = useState(false);
  const [errorMess, setErrorMess] = useState({});
  const [passLoading, setPassLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Preparing Payment...");

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("current_password", currentPass);
    formData.append("password", newPass);
    formData.append("password_confirmation", confirmPass);
    formData.append("_method", "PUT");
    try {
      setPassLoading(true);
      setLoadingMessage("Processing");
      const response = await axios.post(
        "http://127.0.0.1:8000/api/user/passwordChange",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      setChangePass(false);
      setPassLoading(false);
      setPassSuccess(true);
      clearTimeout(successToastTimer.current);
      successToastTimer.current = setTimeout(() => {
        setPassSuccess(false);
      }, 4000);
      // input တွေ clear
      setCurrentPass("");
      setNewPass("");
      setConfirmPass("");
    } catch (error) {
      setPassLoading(false);
      console.log(error.response?.data);
      if (error.response?.data?.errors) {
        setErrorMess(error.response.data.errors);
      } else {
        setErrorMess({
          general: error.response?.data?.message || "Something went wrong.",
        });
      }
    }
  };

  const savedProfileImg = usersData?.profileImg;

  const profileImageUrl = savedProfileImg
    ? /^https?:\/\//i.test(savedProfileImg)
      ? savedProfileImg
      : `http://127.0.0.1:8000/user_profileImg/${savedProfileImg}`
    : "/default-avatar.png";

  const isSocialLogin = userOldData?.loginType == "social";

  return (
    <>
      <div>
        <main>
          {passLoading && <Loading message={loadingMessage} />}
          <div className="profile-shell">
            <div className="back">
              <p className="back-b">
                <span></span>

                <Link to="/menu">
                  <iconify-icon
                    icon="mingcute:arrow-left-fill"
                    width="24"
                    height="24"
                  ></iconify-icon>
                  Back to Home
                </Link>
              </p>
            </div>

            <section className="profile-card">
              {/* Profile Header */}
              <div className="profile-meta">
                <form action="">
                  <div className="profile-avatar-wrap">
                    <div className="profile-avatar" aria-hidden="true">
                      <img
                        src={
                          profileImg instanceof File
                            ? URL.createObjectURL(profileImg)
                            : usersData?.profileImg
                              ? usersData.profileImg.startsWith("http")
                                ? usersData.profileImg
                                : `http://127.0.0.1:8000/user_profileImg/${usersData.profileImg}`
                              : profileImageUrl
                        }
                        alt="Profile"
                      />
                    </div>

                    <label
                      className="profile-image-edit"
                      htmlFor="profileImageInput"
                      title="Edit profile image"
                      style={{ display: isSocialLogin ? "none" : "" }}
                    >
                      <iconify-icon
                        icon="solar:camera-bold"
                        width="18"
                        height="18"
                        disabled={isSocialLogin}
                      ></iconify-icon>
                    </label>

                    <input
                      id="profileImageInput"
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      hidden
                    />
                  </div>
                </form>
                <div>
                  <h2 style={fontStyle}>{usersData?.name}</h2>

                  <p className="small">Member since 2022 · Mandalay</p>
                </div>
              </div>

              {/* Profile Form */}
              <form className="profile-form" id="profileForm">
                <div className="valid" style={validateStyle}>
                  {isError && (
                    <ErrorMessage isError={isError}>
                      Number is Not Allow!
                    </ErrorMessage>
                  )}

                  {isEmail && (
                    <ErrorMessage isEmail={isEmail}>
                      Email must be Email.
                    </ErrorMessage>
                  )}

                  {profileSuccess && (
                    <div className="ps" style={ProSuc}>
                      <h3>Profile Update success</h3>
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="ps" style={ProSuc}>
                      <h3>Password Update success</h3>
                    </div>
                  )}
                </div>

                {/* Full Name */}
                <label>
                  Full name
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => {
                      (setName(e.target.value), handleProfile(e));
                    }}
                  />
                  <span></span>
                </label>

                {/* Email */}
                <label>
                  Email
                  <input
                    type="email"
                    name="email"
                    value={emailInput}
                    onChange={(e) => {
                      (setEmailInput(e.target.value), handleProfile(e));
                    }}
                  />
                </label>

                {/* Save Button */}
                <button
                  className="save-btn"
                  type="button"
                  onClick={userDataUpdate}
                  id="saveProfile"
                  disabled={isSocialLogin}
                  style={{ background: isSocialLogin ? "gray" : "" }}
                >
                  Save profile
                </button>
              </form>

              {changePasss && (
                <div id="passwordModal" className="modal" aria-hidden="true">
                  <div
                    className="modal-overlay"
                    id="passwordModalOverlay"
                  ></div>

                  <div
                    className="modal-content"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="passwordModalTitle"
                  >
                    <button
                      type="button"
                      className="modal-close"
                      id="closePasswordModal"
                      aria-label="Close password modal"
                      style={{ marginRight: "20px" }}
                      onClick={(e) => {
                        setChangePass(false);
                        setCurrentPass("");
                        setNewPass("");
                        setConfirmPass("");
                        setErrorMess({});
                        setShowPassword(false);
                      }}
                    >
                      ×
                    </button>

                    <form
                      id="passwordChangeForm"
                      className="profile-form"
                      onSubmit={handlePasswordChange}
                      style={{
                        padding: "24px",
                        background: "#fff",
                        borderRadius: "18px",
                        boxShadow: "0 20px 40px rgba(0,0,0,.12)",
                        maxWidth: "540px",
                        width: "100%",
                      }}
                    >
                      <h3
                        id="passwordModalTitle"
                        style={{
                          margin: "0 0 18px",
                          fontSize: "1.25rem",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        Change password{" "}
                        <iconify-icon
                          icon="f7:lock-shield-fill"
                          width="24"
                          height="24"
                          style={{ color: "red" }}
                        ></iconify-icon>
                      </h3>

                      <label
                        style={{
                          marginBottom: "14px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        Current password
                        <input
                          id="currentPassword"
                          data-error-id="currentPasswordError"
                          style={{
                            width: "100%",
                            fontSize: "15px",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "10px",
                          }}
                          value={currentPass}
                          onChange={(e) => setCurrentPass(e.target.value)}
                          type={ShowPassword ? "text" : "password"}
                          name="current_password"
                          autoComplete="current-password"
                          required
                        />
                        {errorMess.current_password && (
                          <span
                            id="currentPasswordError"
                            style={{
                              color: "#dc2626",
                              fontSize: "0.9rem",
                            }}
                          >
                            {errorMess.current_password[0]}
                          </span>
                        )}
                      </label>

                      <label
                        style={{
                          marginBottom: "14px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        New password
                        <input
                          id="newPassword"
                          data-error-id="newPasswordError"
                          style={{
                            width: "100%",
                            fontSize: "15px",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "10px",
                          }}
                          type={ShowPassword ? "text" : "password"}
                          name="password"
                          autoComplete="new-password"
                          value={newPass}
                          onChange={(e) => setNewPass(e.target.value)}
                          required
                        />
                        {errorMess.password && (
                          <span
                            id="newPasswordError"
                            style={{
                              color: "#dc2626",
                              fontSize: "0.9rem",
                            }}
                          >
                            {errorMess.password[0]}
                          </span>
                        )}
                      </label>

                      <label
                        style={{
                          marginBottom: "18px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        Confirm new password
                        <input
                          id="confirmPassword"
                          data-error-id="confirmPasswordError"
                          style={{
                            width: "100%",
                            fontSize: "15px",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "10px",
                          }}
                          type={ShowPassword ? "text" : "password"}
                          name="password_confirmation"
                          autoComplete="new-password"
                          value={confirmPass}
                          onChange={(e) => setConfirmPass(e.target.value)}
                          required
                        />
                        {errorMess.password_confirmation && (
                          <span
                            id="confirmPasswordError"
                            style={{
                              color: "#dc2626",
                              fontSize: "0.9rem",
                            }}
                          >
                            {errorMess.password_confirmation[0]}
                          </span>
                        )}
                        <div className="showPass">
                          <input
                            type="checkbox"
                            id="showPassword"
                            checked={ShowPassword}
                            onChange={(e) => setShowPassword(e.target.checked)}
                          />
                          <label htmlFor="showPassword">
                            Show Your Password
                          </label>
                        </div>
                      </label>

                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                          flexWrap: "wrap",
                          justifyContent: "flex-end",
                        }}
                      >
                        <button
                          type="button"
                          className="save-btn"
                          id="cancelPasswordModal"
                          style={{
                            background: "#f3f4f6",
                            color: "#111",
                          }}
                          onClick={(e) => setChangePass(false)}
                        >
                          Cancel
                        </button>

                        <button
                          className="save-btn"
                          type="submit"
                          style={{ marginTop: "0" }}
                          disabled={passLoading}
                        >
                          {passLoading
                            ? "Updating Your Password"
                            : "Update password"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Saved Items */}
              <div className="saved-block" style={{ marginTop: "22px" }}>
                <h3>Saved items</h3>

                <div className="saved-list" id="savedList">
                  {saveItem.length > 0 ? (
                    saveItem.map((item) => (
                      <div
                        className="saved-card"
                        key={item.name}
                        style={saveCartStyle}
                      >
                        <img src={item.image} alt={item.name} style={saveBox} />
                        <div style={{ flex: "1" }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "start",
                            }}
                          >
                            <strong>{item.name}</strong>
                            <span style={{ font: "12px gray" }}>
                              ${item.price}
                            </span>
                          </div>
                          <div
                            style={{
                              marginTop: "8px",
                              display: "flex",
                              gap: "8px",
                            }}
                          >
                            <button
                              className="dark-button add-saved"
                              data-name={item.name}
                              data-price={item.price}
                              style={{ padding: "8px 12px" }}
                              onClick={handleAddCart}
                            >
                              Add to cart{" "}
                              {cartCount > 0 &&
                                `(${getProductQuantity(item.name)})`}
                            </button>
                            <button
                              className="save-remove"
                              data-name={item.name}
                              style={{
                                padding: "8px 12px",
                                borderRadius: "8px",
                                background: "transparent",
                                border: "1px solid red",
                              }}
                              onClick={handleRemoveCart}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No saved items yet.</p>
                  )}
                </div>
              </div>
            </section>

            {/* Account */}
            <aside className="account-actions">
              <h3>Account</h3>

              <Link to="/OrderHistory" style={{ paddingLeft: "5px" }}>
                Order history
              </Link>

              <button
                style={{
                  background: "transparent",
                  display: "flex",
                  alignItems: "start",
                }}
                onClick={(e) => setChangePass(true)}
                disabled={isSocialLogin}
              >
                <a style={{ color: isSocialLogin ? "gray" : "#000" }}>
                  Change Password
                </a>
              </button>

              <button
                style={{ background: "transparent" }}
                onClick={handleLogout}
              >
                <a
                  style={{
                    color: "red",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <iconify-icon
                    icon="hugeicons:logout-circle-02"
                    width="24"
                    height="24"
                  ></iconify-icon>
                  Logout
                </a>
              </button>
            </aside>
          </div>

          {/* Footer */}
          <footer>
            <a className="brand" href="index.html">
              <span className="brand-mark">e</span>

              <span>
                EMBER
                <br />
                &amp; BEAN
              </span>
            </a>

            <p>Made for unhurried mornings.</p>

            <div>
              <a href="#home">Instagram</a>

              <a href="#home">Contact</a>

              <a href="#home">Journal</a>
            </div>

            <small>© 2024 EMBER &amp; BEAN</small>
          </footer>
        </main>
      </div>
    </>
  );
};

export default Profile;
