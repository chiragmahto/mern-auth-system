import axios from "axios";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Activate() {
  const { token } =
    useParams();

  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/api/auth/activate/${token}`
      )
      .then(() => {
        alert(
          "Account Activated"
        );
      })

      .catch(() => {
        alert(
          "Invalid Activation Link"
        );
      });

  }, [token]);

  return (
    <div className="container mt-5">
      <h2>
        Activating Account...
      </h2>
    </div>
  );
}