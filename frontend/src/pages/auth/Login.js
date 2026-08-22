import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
      e.target.value
    });
  };
  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );
      localStorage.setItem(
        "token",
        res.data.token
      );
      navigate("/dashboard");
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Login Failed"
      );
    }
  };
  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={login}>
        <input
          className="form-control mb-3"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button
          className="btn btn-primary"
        >
          Login
        </button>
      </form>
    </div>
  );
}
