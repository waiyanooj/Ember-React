export default function PasswordModal({
  setChangePass,
  setCurrentPass,
  setNewPass,
  setConfirmPass,
  setErrorMess,
  setShowPassword,
  handlePasswordChange,
  currentPass,
  ShowPassword,
  errorMess,
  newPass,
  confirmPass,
  passLoading,
}) {
  return (
    <div id="passwordModal" className="modal" aria-hidden="true">
      <div className="modal-overlay" id="passwordModalOverlay"></div>

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
          onClick={() => {
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
              <label htmlFor="showPassword">Show Your Password</label>
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
              onClick={() => setChangePass(false)}
            >
              Cancel
            </button>

            <button
              className="save-btn"
              type="submit"
              style={{ marginTop: "0" }}
              disabled={passLoading}
            >
              {passLoading ? "Updating Your Password" : "Update password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
