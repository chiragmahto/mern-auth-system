import { useEffect, useState } from "react";

import axios from "axios";

export default function Dashboard() {

  const [stats,
    setStats] =
    useState(null);

  useEffect(() => {

    loadDashboard();

  }, []);

  const loadDashboard =
    async () => {
      try {

        const res =
          await axios.get(
            "http://localhost:5000/api/admin/dashboard",
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

        setStats(
          res.data.stats
        );

      } catch (err) {

        console.log(err);

      }

    };

  if (!stats) {

    return (
      <h3>
        Loading...
      </h3>
    );

  }

  return (

    <div className="container">

      <h2>
        Admin Dashboard
      </h2>
      <div className="row">
        <div className="col-md-4">
          <div className="card p-3">

            <h4>
              Total Users
            </h4>
            <h2>
              {stats.totalUsers}
            </h2>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3">

            <h4>
              Total Admins
            </h4>

            <h2>
              {stats.totalAdmins}
            </h2>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3">
            <h4>
              Blocked Users
            </h4>
            <h2>
              {stats.blockedUsers}
            </h2>
          </div>
        </div>
      </div>
    </div>

  );

}
