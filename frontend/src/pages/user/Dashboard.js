import axios from "axios";
import { useEffect, useState } from "react";
export default function Dashboard() {
  const [user, setUser] =
    useState(null);
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
      setUser(
        res.data.user
      );
    } catch (err) {
      console.log(err);
    }
  };
  if (!user) {
    return (
      <h3>
        Loading...
      </h3>
    );
  }

  return (
    <div className="container mt-5">
      <h2>
        User Dashboard
      </h2>
      <hr />
      {
        user.photo && (
          <img
            src={user.photo}
            alt="profile"
            width="150"
            className="mb-3"
          />
        )
      }

      <h4>
        {user.name}
      </h4>
      <p>
        {user.email}
      </p>
      <p>
        {user.gender}
      </p>
      <p>

        {user.country}
        {" | "}
        {user.state}
        {" | "}
        {user.city}
      </p>
    </div>
  );
}