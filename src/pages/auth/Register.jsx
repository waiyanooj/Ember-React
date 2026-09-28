import { register } from "../../services/auth.js";
import { useState, useEffect } from "react";
import "../../styles/style.css";
import "../../styles/Register.css";
import Styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";

const ErrorMessage = Styled.div`
    color : ${(props) => (props.$isError ? "red" : "")};
    font-size : ${(props) => (props.$isError ? "14px" : "")};
`;

const ErrorEmail = Styled.div`
    color : ${(props) => (props.$isErrorEmail ? "rgba(122, 43, 43, 0.5)" : "")};
    font-size : ${(props) => (props.$isErrorEmail ? "14px" : "")};
`;

const PasswordCheck = Styled.div`
    color : ${(props) => (props.$isPassword ? "rgba(123, 111, 111, 0.65)" : "")};
    font-size : ${(props) => (props.$isPassword ? "14px" : "")};
`;

const PasswordConfirmCheck = Styled.div`
    color : ${(props) => (props.$isConfirmPassword ? "rgba(123, 111, 111, 0.65)" : "")};
    font-size : ${(props) => (props.$isConfirmPassword ? "14px" : "")};
`;

const Register = () => {
  const RequireError = {
    color: "red",
    fontSize: "14px",
  };

  const navigate = useNavigate();

  const [Text, setText] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Require, setRequire] = useState({});
  const [userData, setUserData] = useState(() => {
    const userSave = localStorage.getItem("userData");
    return userSave ? JSON.parse(userSave) : [];
  });
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);

  const isConfirmPassword = Password !== ConfirmPassword;

  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(userData));
  }, [userData]);

  const isError = /\d/.test(Text);

  const handelText = (e) => {
    setText(e.target.value);
  };

  const handelConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const isErrorEmail =
    Email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email);

  const handelEmail = (e) => {
    setEmail(e.target.value);
  };

  const isPassword = Password.length < 8;

  // const handelChange = (e) => {
  //   setPassword(e.target.value);
  // };

  // const handleRequire = (e) => {
  //   e.preventDefault();

  //   const isRequire = {};

  //   if (!Email.trim()) {
  //     isRequire.Email = "Email is Require";
  //   }
  //   if (!Text.trim()) {
  //     isRequire.Text = "User Name is Require.";
  //   }
  //   if (!Password.trim()) {
  //     isRequire.Password = "Password is Require";
  //   }

  //   setRequire(isRequire);

  //   if (Object.keys(isRequire).length > 0) {
  //     return;
  //   }

  //   const newUser = {
  //     name : Text,
  //     email : Email,
  //     password : Password
  //   }

  //   setUserData((prevUserData) => {
  //     return [...prevUserData, newUser];
  //   });

  //    navigate("/");
  // };

  console.log(userData);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isRequire = {};

    if (!Email.trim()) {
      isRequire.Email = "Email is Require";
    }
    if (!Text.trim()) {
      isRequire.Text = "User Name is Require.";
    }
    if (!Password.trim()) {
      isRequire.Password = "Password is Require";
    }

    setRequire(isRequire);

    if (Object.keys(isRequire).length > 0) {
      return;
    }

    // setUserData((prevUserData) => {
    //   return [...prevUserData, newUser];
    // });

    try {
      const response = await register({
        name: Text,
        email: Email,
        password: Password,
        password_confirmation: ConfirmPassword,
      });

      console.log(response.data);

      localStorage.setItem("token", response.data.token);

      localStorage.setItem("userData", JSON.stringify(response.data));

      navigate("/");
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  // const [userData, setUserData] = useState(() => {
  //   const userSave = localStorage.getItem('userData');
  //   return userSave ? JSON.parse(userSave) : [];
  // });

  // useEffect(() => {
  //   localStorage.setItem('userData', JSON.stringify(userData));
  // }, [userData]);

  // const handleAddUser = () => {
  //   const newUser = {
  //     name: Text,
  //     email: Email,
  //     password: Password,
  //   };
  //   setUserData((prevUserData) => {
  //     return [...prevUserData, newUser];
  //   });
  // };

  // console.log(userData);

  return (
    <>
      <main className="Register">
        <div className="auth-card">
          <p className="eyebrow">
            <span></span> CREATE ACCOUNT
          </p>
          <h1>Join Ember & Bean.</h1>
          <p>Create your account to save favorites and place orders faster.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Full name
              <input
                type="text"
                placeholder="Your full name"
                value={Text}
                onChange={(e) => {
                  handelText(e);
                  setText(e.target.value);
                }}
              />
              {/* Required Error */}
              {Require.Text && <span style={RequireError}>{Require.Text}</span>}
              {/* Number Error */}
              {!Require.Text && isError && (
                <ErrorMessage $isError={isError}>
                  Numbers are not allowed.
                </ErrorMessage>
              )}
            </label>

            <label>
              Email
              <input
                type="email"
                placeholder="you@example.com"
                value={Email}
                onChange={(e) => {
                  handelEmail(e);
                  setEmail(e.target.value);
                }}
              />
              {Require.Email && (
                <span style={RequireError}>{Require.Email}</span>
              )}
              {!Require.Email && isErrorEmail && (
                <ErrorEmail $isErrorEmail={isErrorEmail}>
                  Email must be a valid email.
                </ErrorEmail>
              )}
            </label>

            <label>
              Password
              <input
                type={show ? "text" : "password"}
                placeholder="Create a password"
                value={Password}
                onChange={(e) => {
                  handleSubmit(e);
                  setPassword(e.target.value);
                }}
              />
              {Require.Password && (
                <span style={RequireError}>{Require.Password}</span>
              )}
              {!Require.Password && isPassword && (
                <PasswordCheck $isPassword={isPassword}>
                  Password must be 8 characters.
                </PasswordCheck>
              )}
            </label>

            <label>
              Confirm Password
              <input
                type={show ? "text" : "password"}
                placeholder="Confirm your password"
                value={ConfirmPassword}
                onChange={(e) => {
                  handelConfirmPassword(e);
                  setConfirmPassword(e.target.value);
                }}
              />
              {Require.ConfirmPassword && (
                <span style={RequireError}>{Require.ConfirmPassword}</span>
              )}
              {!Require.ConfirmPassword && isConfirmPassword && (
                <PasswordConfirmCheck $isConfirmPassword={isConfirmPassword}>
                  Passwords do not match.
                </PasswordConfirmCheck>
              )}
              <div className="showPass" style={{ marginTop: "5px" }}>
                <input
                  type="checkbox"
                  id="showPassword"
                  checked={show}
                  onChange={(e) => setShow(e.target.checked)}
                />
                <label htmlFor="showPassword" style={{ marginTop: "0px" }}>
                  Show Your Password
                </label>
              </div>
            </label>

            <button className="auth-btn" type="submit">
              Create account
            </button>
          </form>

          <p className="auth-link">
            <Link to="/login">Already an account?</Link>
          </p>
        </div>
      </main>
    </>
  );
};

export default Register;
