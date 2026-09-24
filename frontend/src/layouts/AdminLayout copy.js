import { Outlet, useNavigate } from "react-router-dom";
export default function AdminLayout() {
    const navigate = useNavigate();
    const logout = () => {

  localStorage.removeItem(
    "adminToken"
  );
  localStorage.removeItem(
    "adminRole"
  );

  navigate(
    "/admin/login"
  );

};

  return (
    <div
      className="d-flex"
    >
      <aside
        className="bg-dark text-white p-3"
        style={{
          width: "250px",
          minHeight: "100vh"
        }}
      >
        <h4>
          Admin Sidebar
        </h4>
        <hr />
        Dashboard
        <br />
        Users
      </aside>
      <div
        className="flex-grow-1"
      >
        <header
          className="bg-primary text-white p-3"
        >
          Admin Header
        </header>
        <div
          className="container mt-4"
        >
            <button
  className="btn btn-danger"
  onClick={logout}
>
 Logout
</button>
          <Outlet />
        </div>
      </div>
    </div>
  );
}