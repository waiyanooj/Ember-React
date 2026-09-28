import { exchangeGoogleCode } from "../../services/auth.js";
import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

function SocialLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    const exchangeCode = async () => {
      const params = new URLSearchParams(window.location.search);

      const code = params.get("code");

      if (!code) {
        navigate("/login");
        return;
      }

      try {
        const response = await exchangeGoogleCode({
          code: code,
        });

        console.log(response.data);

        localStorage.setItem("token", response.data.token);

        localStorage.setItem(
          "userData",
          JSON.stringify({ ...response.data, loginType: "social" }),
        );

        navigate("/");
      } catch (error) {
        console.log(error.response?.data);

        navigate("/login");
      }
    };

    exchangeCode();
  }, [navigate]);
}

export default SocialLogin;
