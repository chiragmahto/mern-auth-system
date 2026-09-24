import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";

import AdminRoute from "./components/AdminRoute";
import AuthRedirect from "./components/AuthRedirect";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";

// AUTH PAGES
import Activate from "./pages/auth/Activate";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";

// USER PAGES
import ChangePassword from "./pages/user/ChangePassword";
import Dashboard from "./pages/user/Dashboard";
import EditProfile from "./pages/user/EditProfile";

// ADMIN PAGES

import AdminDashboard from "./pages/admin/Dashboard";
import AdminLogin from "./pages/admin/Login";
import Users from "./pages/admin/Users";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH */}
        <Route
          path="/login"
          element={
            <AuthRedirect>
              <Login />
            </AuthRedirect>
          }
        />
        <Route
          path="/register"
          element={
            <AuthRedirect>
              <Register />
            </AuthRedirect>
          }
        />
        <Route
          path="/activate/:token"
          element={<Activate />}
        />
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />
        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />
        {/* USER */}

        <Route
          element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
          <Route
            path="/edit-profile"
            element={<EditProfile />}
          />
          <Route
            path="/change-password"
            element={<ChangePassword />}
          />
        </Route>

        {/* ADMIN */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />
        <Route
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />
          <Route
            path="/admin/users"
            element={<Users />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;