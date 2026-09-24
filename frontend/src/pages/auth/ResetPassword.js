import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ResetPassword() {
  const { token } =
    useParams();
  const navigate =
    useNavigate();
  const [password,
    setPassword] =
    useState("");
  const submit = async (e) => {
    e.preventDefault();
    try {
      const res =
        await axios.post(
          `http://localhost:5000/api/auth/reset-password/${token}`,
          {
            password
          }
        );
      alert(
        res.data.message
      );
      navigate("/login");
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Reset Failed"
      );
    }
  };

  return (
    <div className="container mt-5">
      <h2>
        Reset Password
      </h2>

      <form onSubmit={submit}>
        <input
          className="form-control mb-3"
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e)=>
            setPassword(
              e.target.value
            )
          }

        />

        <button
          className="btn btn-danger"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}