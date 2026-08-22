import axios from "axios";
import { useEffect, useState } from "react";

export default function EditProfile() {
  const [form, setForm] =
    useState({
      name: "",
      email: "",
      gender: "",
      country: "",
      state: "",
      city: "",
      photo: ""
    });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res =
        await axios.get(
          "http://localhost:5000/api/users/profile",
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

      setForm(
        res.data.user
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
      e.target.value
    });
  };

  const handlePhoto = (e) => {
    const file =
      e.target.files[0];
    const reader =
      new FileReader();
    reader.onloadend = () => {
      setForm({
        ...form,
        photo:
          reader.result
      });
    };
    reader.readAsDataURL(
      file
    );
  };

  const updateProfile =
    async (e) => {
      e.preventDefault();
      try {
        const res =
          await axios.put(
            "http://localhost:5000/api/users/edit-profile",
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
      } catch (err) {
        alert(
          err.response?.data
            ?.message ||
          "Update Failed"
        );
      }
    };
  return (
    <div className="container mt-5">
      <h2>
        Edit Profile
      </h2>
      <form
        onSubmit={
          updateProfile
        }
      >
        <input
          className="form-control mb-3"
          name="name"
          value={form.name}
          onChange={
            handleChange
          }
        />
        <input
          className="form-control mb-3"
          name="email"
          value={form.email}
          onChange={
            handleChange
          }
        />

        <input
          className="form-control mb-3"
          name="gender"
          value={form.gender}
          onChange={
            handleChange
          }
        />

        <input
          className="form-control mb-3"
          name="country"
          value={form.country}
          onChange={
            handleChange
          }
        />

        <input
          className="form-control mb-3"
          name="state"
          value={form.state}
          onChange={
            handleChange
          }
        />

        <input
          className="form-control mb-3"
          name="city"
          value={form.city}
          onChange={
            handleChange
          }
        />

        <input
          type="file"
          className="form-control mb-3"
          onChange={
            handlePhoto
          }
        />

        <button
          className="btn btn-success"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}