import React, { useEffect } from "react";
import axios from "axios";
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
                const response = await axios.post(
                    "http://127.0.0.1:8000/api/user/google/exchange",
                    {
                        code: code,
                    }
                );

                console.log(response.data);

                localStorage.setItem(
                    "token",
                    response.data.token
                );

                localStorage.setItem(
                    "userData"
                    ,
                    JSON.stringify({...response.data,loginType : "social"})
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