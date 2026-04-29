import { useUser, useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { setAuthToken } from "../../api/axios";
import { registerUser } from "../../api/userApi";
import { useNavigate } from "react-router-dom";
import { useAppAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const SelectRole = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { user: appUser } = useAppAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("");
  const [institutions, setInstitutions] = useState([]);
  const [institutionId, setInstitutionId] = useState("");

  const [newInstitution, setNewInstitution] = useState("");
  const [creating, setCreating] = useState(false);

  // redirect if already registered
  useEffect(() => {
    if (appUser) navigate("/");
  }, [appUser]);

  // ✅ FIX: set token FIRST, then fetch institutions in one effect
  const fetchInstitutions = async () => {
    try {
      const res = await api.get("/institutions");
      setInstitutions(res.data);
    } catch (err) {
      console.error("Failed to fetch institutions:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      const token = await getToken();
      setAuthToken(token); // token set first
      await fetchInstitutions(); // then fetch
    };
    init();
  }, []);

  // create institution
  const handleCreateInstitution = async () => {
    if (!newInstitution) return alert("Enter institution name");

    try {
      const res = await api.post("/institutions", { name: newInstitution });
      setInstitutionId(String(res.data.id)); // ✅ store as string to match select value
      setNewInstitution("");
      setCreating(false);
      await fetchInstitutions();
    } catch (err) {
      console.error(err);
    }
  };

  // FINAL SUBMIT
  const handleSubmit = async () => {
    try {
      if (!selectedRole) return alert("Select role");

      if (
        ["student", "trainer", "institution_admin"].includes(selectedRole) &&
        !institutionId
      ) {
        return alert("Select or create institution");
      }
      const userData = {
        clerkId: user.id,
        name: user.fullName,
        email: user.primaryEmailAddress?.emailAddress,
        role: selectedRole,
        institution_id: ["student", "trainer", "institution_admin"].includes(
          selectedRole,
        )
          ? Number(institutionId)
          : null,
      };
      // console.log(userData);
      await registerUser(userData);

      const routeMap = {
        student: "/student/dashboard",
        trainer: "/trainer/dashboard",
        institution_admin: "/institution_admin/dashboard",
        programme_manager: "/programme_manager/dashboard",
        monitoring_officer: "/mo/dashboard",
      };

      navigate(routeMap[selectedRole]);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[420px]">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Select Your Role
        </h2>

        {/* ROLE SELECT */}
        <div className="space-y-3 mb-4">
          {[
            "student",
            "trainer",
            "institution_admin",
            "programme_manager",
            "monitoring_officer",
          ].map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`w-full py-2 rounded font-medium ${
                selectedRole === role
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {role.replace(/_/g, " ").toUpperCase()}
            </button>
          ))}
        </div>

        {/* INSTITUTION SECTION */}
        {["student", "trainer", "institution_admin"].includes(selectedRole) && (
          <div className="mb-4">
            <label className="block mb-1 font-medium">Select Institution</label>

            <select
              className="w-full border p-2 rounded mb-2"
              value={institutionId || ""}
              onChange={(e) => setInstitutionId(e.target.value)}
            >
              <option value="">-- Select --</option>
              {institutions.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name}
                </option>
              ))}
            </select>

            {/* CREATE NEW — only for institution_admin */}
            {selectedRole === "institution_admin" &&
              (!creating ? (
                <button
                  className="text-blue-600 text-sm"
                  onClick={() => setCreating(true)}
                >
                  + Create new institution
                </button>
              ) : (
                <div className="mt-2">
                  <input
                    className="w-full border p-2 rounded mb-2"
                    placeholder="Enter institution name"
                    value={newInstitution}
                    onChange={(e) => setNewInstitution(e.target.value)}
                  />
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                    onClick={handleCreateInstitution}
                  >
                    Create
                  </button>
                  <button
                    className="bg-gray-400 text-white px-3 py-1 rounded"
                    onClick={() => setCreating(false)}
                  >
                    Cancel
                  </button>
                </div>
              ))}
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SelectRole;
