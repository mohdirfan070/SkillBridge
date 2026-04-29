import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAppAuth } from "../../context/AuthContext";

const JoinBatch = () => {
  const { id } = useParams();
  const { user } = useAppAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState("idle");
    console.log("working");
  useEffect(() => {
    // wait for auth to load
    if (user === undefined) return;

    // not logged in — redirect to login
    if (user === null) {
      navigate(`/login?redirect=/join-batch/${id}`);
      return;
    }

    // non-students shouldn't join batches
    if (user.role !== "student") {
      navigate("/");
      return;
    }

    const join = async () => {
      setStatus("joining");
      try {
        await api.post(`/batches/${id}/join`); // ✅ no body needed
        setStatus("success");
        setTimeout(() => navigate("/student/dashboard"), 6000);
      } catch (err) {
        if (err.response?.status === 409) {
          setStatus("already_joined");
          setTimeout(() => navigate("/student/dashboard"), 6000);
        } else {
          setStatus("error");
        }
      }
    };

    join();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow text-center w-80">
        {status === "idle" || status === "joining" ? (
          <>
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-600 font-medium">Joining batch...</p>
          </>
        ) : status === "success" ? (
          <>
            <div className="text-4xl mb-4">✅</div>
            <p className="text-green-600 font-semibold text-lg">
              Joined successfully!
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Redirecting to dashboard...
            </p>
          </>
        ) : status === "already_joined" ? (
          <>
            <div className="text-4xl mb-4">ℹ️</div>
            <p className="text-blue-600 font-semibold text-lg">
              Already in this batch
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Redirecting to dashboard...
            </p>
          </>
        ) : (
          <>
            <div className="text-4xl mb-4">❌</div>
            <p className="text-red-500 font-semibold">Failed to join batch</p>
            <p className="text-gray-400 text-sm mt-1">
              The link may be invalid or expired
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
            >
              Go Home
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default JoinBatch;
