import styled from "styled-components";

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

export default function ProfileForm({
  validateStyle,
  isError,
  isEmail,
  profileSuccess,
  ProSuc,
  passwordSuccess,
  name,
  setName,
  handleProfile,
  emailInput,
  setEmailInput,
  userDataUpdate,
  isSocialLogin,
}) {
  return (
    <form className="profile-form" id="profileForm">
      <div className="valid" style={validateStyle}>
        {isError && (
          <ErrorMessage isError={isError}>Number is Not Allow!</ErrorMessage>
        )}

        {isEmail && (
          <ErrorMessage isEmail={isEmail}>Email must be Email.</ErrorMessage>
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
  );
}
