import axios from "axios";
import { useState } from "react";
export default function ChangePassword() {

  const [form, setForm] =
    useState({
      oldPassword: "",
      newPassword: ""
    });

  const handleChange =
    (e) => {

      setForm({
        ...form,
        [e.target.name]:
        e.target.value
      });
    };

  const submit =
    async (e) => {
      e.preventDefault();
      try {
        const res =
          await axios.put(
            "http://localhost:5000/api/users/change-password",
            form,
            {
              headers: {

                Authorization:
                  "Bearer " +
                  localStorage.getItem(
                    "token"
                  )
              }
            }
          );

        alert(
          res.data.message
        );
        setForm({
          oldPassword: "",
          newPassword: ""
        });
      } catch (err) {
        alert(
          err.response?.data
            ?.message ||
          "Password Change Failed"
        );
      }
    };
  return (
    <div className="container mt-5">
      <h2>
        Change Password
      </h2>
      <form
        onSubmit={submit}
      >

        <input
          className="form-control mb-3"
          type="password"
          name="oldPassword"
          placeholder="Old Password"
          value={
            form.oldPassword
          }
          onChange={
            handleChange
          }

        />

        <input

          className="form-control mb-3"
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={
            form.newPassword
          }
          onChange={
            handleChange
          }
        />
        <button
          className="btn btn-primary"
        >
          Change Password
        </button>
      </form>
    </div>

  );

}