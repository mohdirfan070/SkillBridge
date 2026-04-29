import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense } from "react";

import { AuthProvider } from "./context/AuthContext";
import SignupPage from "./pages/Auth/SignupPage";
import SelectRole from "./pages/Auth/SelectRole";

import Layout from "./components/Layout";
import Home from "./pages/Home/Home";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoutes";

import { dashboardRoutes } from "./routes/DashboardRoutes";
import LoginPage from "./pages/Auth/LoginPage";
import FallbackPage from "./pages/FallbackPage";
import JoinBatch from "./pages/JoinBatch/JoinBatch";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-screen">
              Loading...
            </div>
          }
        >
          <Routes>
            {/* Layout Wrapper (Navbar + Footer + Outlet) */}
            <Route element={<Layout />}>
              {/* Public Page */}
              <Route path="/" element={<Home />} />

              {/* Protected Dashboards */}
              {dashboardRoutes.map(({ path, allowedRoles, element }) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <ProtectedRoute allowedRoles={allowedRoles}>
                      {element}
                    </ProtectedRoute>
                  }
                />
              ))}
              <Route path="/join-batch/:id" element={<JoinBatch />} />
              {/* Unauthorized */}
              <Route path="/unauthorized" element={<Unauthorized />} />
            </Route>
            <Route path="/*" element={<FallbackPage />} />
            {/* Auth Pages (NO Layout) */}
            <Route path="/login/*" element={<LoginPage />} />
            <Route path="/signup/*" element={<SignupPage />} />
            <Route path="/select-role" element={<SelectRole />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;
