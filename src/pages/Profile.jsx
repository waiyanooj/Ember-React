import ProfileForm from "../components/profile/ProfileForm.jsx";
import SavedItems from "../components/profile/SavedItems.jsx";
import PasswordModal from "../components/profile/PasswordModal.jsx";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../services/profile.js";
import { logout } from "../services/auth.js";
import { useState, useEffect, useRef } from "react";

import "../styles/Profile.css";
import { Link } from "react-router-dom";

import Loading from "../components/Loading.jsx";

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
      const response = await getProfile({
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
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

      const response = await updateProfile(formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

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

      await logout(
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
      const response = await changePassword(formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

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
              <ProfileForm
                validateStyle={validateStyle}
                isError={isError}
                isEmail={isEmail}
                profileSuccess={profileSuccess}
                ProSuc={ProSuc}
                passwordSuccess={passwordSuccess}
                name={name}
                setName={setName}
                handleProfile={handleProfile}
                emailInput={emailInput}
                setEmailInput={setEmailInput}
                userDataUpdate={userDataUpdate}
                isSocialLogin={isSocialLogin}
              />

              {changePasss && (
                <PasswordModal
                  setChangePass={setChangePass}
                  setCurrentPass={setCurrentPass}
                  setNewPass={setNewPass}
                  setConfirmPass={setConfirmPass}
                  setErrorMess={setErrorMess}
                  setShowPassword={setShowPassword}
                  handlePasswordChange={handlePasswordChange}
                  currentPass={currentPass}
                  ShowPassword={ShowPassword}
                  errorMess={errorMess}
                  newPass={newPass}
                  confirmPass={confirmPass}
                  passLoading={passLoading}
                />
              )}

              {/* Saved Items */}
              <SavedItems
                saveItem={saveItem}
                saveCartStyle={saveCartStyle}
                saveBox={saveBox}
                handleAddCart={handleAddCart}
                cartCount={cartCount}
                getProductQuantity={getProductQuantity}
                handleRemoveCart={handleRemoveCart}
              />
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
                onClick={() => setChangePass(true)}
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
