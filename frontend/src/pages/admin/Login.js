import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {

  const navigate =
    useNavigate();

  const [form, setForm] =
    useState({
      email: "",
      password: ""
    });

  const handleChange =
    (e) => {
      setForm({
        ...form,
        [e.target.name]:
        e.target.value
      });

    };

  const login =
    async (e) => {
      e.preventDefault();
      try {

        const res =
          await axios.post(
            "http://localhost:5000/api/admin/login",
            form
          );

        localStorage.setItem(
          "adminToken",
          res.data.token

        );

        localStorage.setItem(
          "adminRole",
          "admin"
        );
        navigate(
          "/admin/dashboard"
        );
      } catch (err) {
        alert(
          err.response?.data
            ?.message ||
          "Login Failed"
        );
      }
    };

  return (

    <div className="container mt-5">
      <h2>
        Admin Login
      </h2>
      <form onSubmit={login}>
        <input
          className="form-control mb-3"
          name="email"
          placeholder="Email"
          onChange={
            handleChange
          }
        />

        <input

          className="form-control mb-3"
          name="password"
          type="password"

          placeholder="Password"

          onChange={
            handleChange
          }

        />
        <button
          className="btn btn-danger"
        >
          Login
        </button>

      </form>

    </div>

  );

}