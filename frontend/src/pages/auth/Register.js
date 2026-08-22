import {
  useEffect,
  useState
} from "react";

import axios from "axios";

import {
  useNavigate
} from "react-router-dom";

export default function Register() {

  const navigate =
    useNavigate();

  const [form, setForm] =
    useState({

      name: "",
      email: "",

      password: "",
      confirmPassword: "",

      gender: "",

      country: "",
      state: "",
      city: "",

      photo: "",

      captcha: "",
      captchaAnswer: ""

    });

  const [idCard,
    setIdCard] =
    useState(null);

  const [captcha,
    setCaptcha] =
    useState("");

  const locationData = {

    India: {

      Jharkhand: [
        "Ranchi",
        "Dhanbad",
        "Bokaro"
      ],

      Bihar: [
        "Patna",
        "Gaya",
        "Muzaffarpur"
      ]

    },

    USA: {

      California: [
        "Los Angeles",
        "San Diego"
      ],

      Texas: [
        "Dallas",
        "Austin"
      ]

    }

  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {

    const a =
      Math.floor(
        Math.random() * 10
      );

    const b =
      Math.floor(
        Math.random() * 10
      );

    setCaptcha(
      `${a} + ${b}`
    );

    setForm(prev => ({
      ...prev,
      captchaAnswer:
        a + b
    }));
  };

  const handleChange =
    (e) => {

      setForm({
        ...form,
        [e.target.name]:
          e.target.value
      });

    };

  const handlePhoto =
    (e) => {

      const file =
        e.target.files[0];

      if (!file) return;

      const reader =
        new FileReader();

      reader.onloadend =
        () => {

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

  const register =
    async (e) => {

      e.preventDefault();

      if (
        form.password !==
        form.confirmPassword
      ) {
        alert(
          "Passwords do not match"
        );
        return;
      }

      if (
        parseInt(
          form.captcha
        ) !==
        parseInt(
          form.captchaAnswer
        )
      ) {
        alert(
          "Captcha incorrect"
        );
        return;
      }

      try {

        const formData =
          new FormData();

        Object.keys(form)
          .forEach(key => {

            formData.append(
              key,
              form[key]
            );

          });

        if (idCard) {

          formData.append(
            "idCard",
            idCard
          );

        }

        await axios.post(
          "http://localhost:5000/api/auth/register",
          formData
        );

        alert(
          "Registration successful. Check your email."
        );

        navigate(
          "/login"
        );

      } catch (err) {

        alert(
          err.response?.data?.message ||
          "Registration Failed"
        );

      }

    };

  return (

    <div className="container mt-5">

      <div className="card p-4 shadow">

        <h2 className="mb-4">
          Register
        </h2>

        <form
          onSubmit={
            register
          }
        >

          <input
            className="form-control mb-3"
            name="name"
            placeholder="Full Name"
            onChange={
              handleChange
            }
          />

          <input
            className="form-control mb-3"
            name="email"
            type="email"
            placeholder="Email"
            onChange={
              handleChange
            }
          />

          <input
            className="form-control mb-3"
            type="password"
            name="password"
            placeholder="Password"
            onChange={
              handleChange
            }
          />

          <input
            className="form-control mb-3"
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={
              handleChange
            }
          />

          <select
            className="form-select mb-3"
            name="gender"
            onChange={
              handleChange
            }
          >
            <option value="">
              Select Gender
            </option>

            <option value="Male">
              Male
            </option>

            <option value="Female">
              Female
            </option>

            <option value="Other">
              Other
            </option>

          </select>

          <select
            className="form-select mb-3"
            name="country"
            onChange={
              handleChange
            }
          >
            <option value="">
              Select Country
            </option>

            {
              Object.keys(
                locationData
              ).map(country => (
                <option
                  key={country}
                  value={country}
                >
                  {country}
                </option>
              ))
            }

          </select>

          <select
            className="form-select mb-3"
            name="state"
            onChange={
              handleChange
            }
          >
            <option value="">
              Select State
            </option>

            {
              form.country &&
              Object.keys(
                locationData[
                  form.country
                ]
              ).map(state => (
                <option
                  key={state}
                  value={state}
                >
                  {state}
                </option>
              ))
            }

          </select>

          <select
            className="form-select mb-3"
            name="city"
            onChange={
              handleChange
            }
          >
            <option value="">
              Select City
            </option>

            {
              form.country &&
              form.state &&
              locationData[
                form.country
              ][
                form.state
              ].map(city => (
                <option
                  key={city}
                  value={city}
                >
                  {city}
                </option>
              ))
            }

          </select>

          <label className="form-label">
            Profile Photo
          </label>

          <input
            type="file"
            className="form-control mb-3"
            accept="image/*"
            onChange={
              handlePhoto
            }
          />

          <label className="form-label">
            Upload ID Card
          </label>

          <input
            type="file"
            className="form-control mb-3"
            onChange={(e) =>
              setIdCard(
                e.target.files[0]
              )
            }
          />

          <div className="mb-2">
            Solve:
            <strong>
              {" "}
              {captcha}
            </strong>
          </div>

          <input
            className="form-control mb-2"
            name="captcha"
            placeholder="Captcha Answer"
            onChange={
              handleChange
            }
          />

          <button
            type="button"
            className="btn btn-secondary mb-3"
            onClick={
              generateCaptcha
            }
          >
            Refresh Captcha
          </button>

          <br />

          <button
            className="btn btn-success w-100"
          >
            Register
          </button>

        </form>

      </div>

    </div>

  );

}
