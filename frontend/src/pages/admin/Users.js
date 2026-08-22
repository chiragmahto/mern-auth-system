import axios from "axios";
import { useEffect, useState } from "react";

export default function Users() {

  const [users, setUsers] =
    useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers =
    async () => {

      try {

        const res =
          await axios.get(
            "http://localhost:5000/api/admin/users",
            {
              headers: {
                Authorization:
                  "Bearer " +
                  localStorage.getItem(
                    "adminToken"
                  )
              }
            }
          );

        setUsers(
          res.data.users
        );

      } catch (err) {
        console.log(err);
      }

    };

  const deleteUser =
    async (id) => {

      if (
        !window.confirm(
          "Delete User?"
        )
      ) {
        return;
      }

      try {

        await axios.delete(
          `http://localhost:5000/api/admin/users/${id}`,
          {
            headers: {
              Authorization:
                "Bearer " +
                localStorage.getItem(
                  "adminToken"
                )
            }
          }
        );

        loadUsers();

      } catch (err) {
        console.log(err);
      }

    };

  const blockUser =
    async (id) => {

      try {

        await axios.put(
          `http://localhost:5000/api/admin/users/${id}/block`,
          {},
          {
            headers: {
              Authorization:
                "Bearer " +
                localStorage.getItem(
                  "adminToken"
                )
            }
          }
        );

        loadUsers();

      } catch (err) {
        console.log(err);
      }

    };

  return (

    <div className="container-fluid mt-4">

      <h2 className="mb-4">
        User Management
      </h2>

      <div className="table-responsive">

        <table className="table table-bordered table-striped table-hover">

          <thead className="table-dark">

            <tr>

              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Country</th>
              <th>State</th>
              <th>City</th>
              <th>Role</th>
              <th>Verified</th>
              <th>Status</th>
              <th>ID Card</th>
              <th>Created</th>
              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {users.map((user) => (

              <tr key={user._id}>

                <td>

                  {user.photo ? (

                    <img
                      src={user.photo}
                      alt="profile"
                      width="60"
                      height="60"
                      style={{
                        objectFit: "cover",
                        borderRadius: "50%"
                      }}
                    />

                  ) : (

                    <span>
                      No Photo
                    </span>

                  )}

                </td>

                <td>
                  {user.name}
                </td>

                <td>
                  {user.email}
                </td>

                <td>
                  {user.gender || "-"}
                </td>

                <td>
                  {user.country || "-"}
                </td>

                <td>
                  {user.state || "-"}
                </td>

                <td>
                  {user.city || "-"}
                </td>

                <td>

                  <span
                    className={
                      user.role === "admin"
                        ? "badge bg-danger"
                        : "badge bg-primary"
                    }
                  >
                    {user.role}
                  </span>

                </td>

                <td>

                  {user.isVerified ? (
                    <span className="badge bg-success">
                      Verified
                    </span>
                  ) : (
                    <span className="badge bg-warning text-dark">
                      Pending
                    </span>
                  )}

                </td>

                <td>

                  {user.isBlocked ? (
                    <span className="badge bg-danger">
                      Blocked
                    </span>
                  ) : (
                    <span className="badge bg-success">
                      Active
                    </span>
                  )}

                </td>

                <td>

                  {user.idCard ? (

                    <a
                      href={`http://localhost:5000/uploads/idcards/${user.idCard}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-info"
                    >
                      View
                    </a>

                  ) : (

                    "N/A"

                  )}

                </td>

                <td>

                  {new Date(
                    user.createdAt
                  ).toLocaleDateString()}

                </td>

                <td>

                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() =>
                      blockUser(
                        user._id
                      )
                    }
                  >
                    {
                      user.isBlocked
                        ? "Unblock"
                        : "Block"
                    }
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() =>
                      deleteUser(
                        user._id
                      )
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}