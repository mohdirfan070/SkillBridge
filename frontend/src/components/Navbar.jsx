import { SignOutButton } from "@clerk/clerk-react";
import { useAppAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Navbar() {
  const { user } = useAppAuth();

  return (
    <nav className="flex justify-between items-center w-full bg-slate-300 h-20 px-6">

      {/* Left */}
      <Link to="/">
        <h1 className="text-2xl font-semibold">
          {user ? `Welcome ${user.name}` : "Training System"}
        </h1>
      </Link>

      {/* Right */}
      <div className="flex items-center gap-4">

        {user ? (
          <>
            {/* Dashboard */}
            {user.role && (
              <Link
                className="px-4 py-2 bg-green-500 text-white rounded"
                to={`/${user.role}/dashboard`}
              >
                Dashboard
              </Link>
            )}

            {/* Logout */}
            <SignOutButton>
              <button className="px-4 py-2 bg-red-500 text-white rounded">
                Logout
              </button>
            </SignOutButton>
          </>
        ) : (
          <>
            {/* Sign In */}
            <Link
              className="px-4 py-2 bg-blue-500 text-white rounded"
              to="/login"
            >
              Sign In
            </Link>

            {/* Sign Up */}
            <Link
              className="px-4 py-2 bg-green-600 text-white rounded"
              to="/signup"
            >
              Sign Up
            </Link>
          </>
        )}

      </div>
    </nav>
  );
}

export default Navbar;