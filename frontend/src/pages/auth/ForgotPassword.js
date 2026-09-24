import axios from "axios";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] =
    useState("");
  const submit = async (e) => {
    e.preventDefault();
    try {
      const res =
        await axios.post(
          "http://localhost:5000/api/auth/forgot-password",
          { email }
        );
      alert(
        res.data.message
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Something went wrong"
      );
    }
  };

  return (
    <div className="container mt-5">
      <h2>
        Forgot Password
      </h2>
      <form onSubmit={submit}>
        <input
          className="form-control mb-3"
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e)=>
            setEmail(
              e.target.value
            )
          }
        />

        <button
          className="btn btn-warning"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
}