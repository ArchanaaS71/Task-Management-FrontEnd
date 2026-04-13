import { useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "/login",
        new URLSearchParams({
          username: email,
          password: password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      localStorage.setItem("token", response.data.access_token);
      navigate("/boards");
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div
      style={{
        position: "fixed",     
        inset: 0,              
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: "420px",
          padding: "28px 32px 30px",
          borderRadius: "18px",
          border: "1px solid var(--border)",
          background: "var(--bg)",
          boxShadow: "var(--shadow)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "26px",
            margin: "0 0 22px 0",
          }}
        >
          Login
        </h1>

        {error && (
          <p
            style={{
              color: "var(--accent)",
              textAlign: "center",
              fontSize: "14px",
              marginBottom: "16px",
            }}
          >
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px 14px",
            marginBottom: "14px",
            borderRadius: "10px",
            border: "1px solid var(--border)",
            fontSize: "15px",
            background: "var(--code-bg)",
            color: "var(--text-h)",
            boxSizing: "border-box",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px 14px",
            marginBottom: "20px",
            borderRadius: "10px",
            border: "1px solid var(--border)",
            fontSize: "15px",
            background: "var(--code-bg)",
            color: "var(--text-h)",
            boxSizing: "border-box",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            background: "var(--accent)",
            color: "white",
            fontSize: "15px",
            cursor: "pointer",
            boxSizing: "border-box",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
