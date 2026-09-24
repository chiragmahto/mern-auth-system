import { Outlet, useNavigate } from "react-router-dom";
export default function UserLayout() {
    const navigate =
  useNavigate();

const logout = () => {
  localStorage.removeItem(
    "token"
  );
  navigate("/login");
};
  return (
    <>
      <header
        className="bg-primary text-white p-3"
      >
        <h3>
          User Header
        </h3>
      </header>
      <nav
        className="bg-light p-2"
      >
        User Navigation
      </nav>
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
      <footer
        className="bg-dark text-white p-3 mt-5"
      >
        User Footer
      </footer>
    </>
  );
}