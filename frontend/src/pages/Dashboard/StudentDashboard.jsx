import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useAppAuth } from "../../context/AuthContext";

// parse date in local timezone to avoid UTC off-by-one-day issue
const getDateStr = (dateVal) => {
  const d = new Date(dateVal);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

function StudentDashboard() {
  const { user } = useAppAuth();
  const [sessions, setSessions] = useState([]);
  const [markedSessions, setMarkedSessions] = useState({});
  const [loading, setLoading] = useState(true);
  const [inviteLink, setInviteLink] = useState("");
  const [joinStatus, setJoinStatus] = useState("");

  useEffect(() => {
    if (user?.id) loadSessions();
  }, [user]);

  const isSessionActive = (session) => {
    const dateStr = getDateStr(session.date);
    const endDateTime = new Date(`${dateStr}T${session.end_time}`);
    return new Date() < endDateTime;
  };

  const loadSessions = async () => {
    try {
      const res = await api.get("/sessions/my");
      setSessions(res.data);

      const marked = {};
      const absentPromises = [];

      res.data.forEach((s) => {
        if (s.attendance_status) {
          // already marked in DB
          marked[s.id] = s.attendance_status;
        } else {
          const dateStr = getDateStr(s.date);
          const endDateTime = new Date(`${dateStr}T${s.end_time}`);
          if (new Date() > endDateTime) {
            // session ended, never marked — auto mark absent
            marked[s.id] = "absent";
            absentPromises.push(
              api.post("/attendance/mark", {
                session_id: s.id,
                status: "absent",
              }).catch(() => {})
            );
          }
          // else: session still active — no status, show Mark Present button
        }
      });

      await Promise.all(absentPromises);
      setMarkedSessions(marked);
    } catch (err) {
      console.error("Error fetching sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  const joinBatch = async () => {
    if (!inviteLink.trim()) return alert("Paste an invite link");
    try {
      const batchId = inviteLink.trim().split("/join-batch/")[1];
      if (!batchId) return alert("Invalid invite link");
      await api.post(`/batches/${batchId}/join`);
      setJoinStatus("success");
      setInviteLink("");
      loadSessions();
    } catch (err) {
      if (err.response?.status === 409) {
        setJoinStatus("already_joined");
      } else {
        setJoinStatus("error");
      }
    }
  };

  const markAttendance = async (sessionId) => {
    try {
      await api.post("/attendance/mark", {
        session_id: sessionId,
        status: "present",
      });
      setMarkedSessions((prev) => ({ ...prev, [sessionId]: "present" }));
    } catch (err) {
      const msg = err.response?.data?.error || "";
      if (msg.includes("ended")) {
        alert("Session has already ended.");
        setMarkedSessions((prev) => ({ ...prev, [sessionId]: "absent" }));
      } else {
        console.error("Error marking attendance:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Student Dashboard</h1>
      <p className="text-gray-500 mb-6">Welcome, {user?.name}</p>

      {/* JOIN BATCH */}
      <div className="mb-8 border p-4 rounded-lg shadow-sm bg-white">
        <h2 className="text-lg font-semibold mb-3">Join a Batch</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={inviteLink}
            onChange={(e) => {
              setInviteLink(e.target.value);
              setJoinStatus("");
            }}
            placeholder="Paste invite link here"
            className="border px-3 py-2 rounded flex-1 text-sm"
          />
          <button
            onClick={joinBatch}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Join
          </button>
        </div>
        {joinStatus === "success" && (
          <p className="text-green-600 text-sm mt-2">✅ Joined batch successfully!</p>
        )}
        {joinStatus === "already_joined" && (
          <p className="text-blue-500 text-sm mt-2">ℹ️ You are already in this batch.</p>
        )}
        {joinStatus === "error" && (
          <p className="text-red-500 text-sm mt-2">❌ Invalid link or something went wrong.</p>
        )}
      </div>

      {/* SESSIONS */}
      <h2 className="text-lg font-semibold mb-3">My Sessions</h2>
      {sessions.length === 0 ? (
        <div className="border p-6 rounded-lg text-center text-gray-500 bg-white">
          <p>No sessions yet.</p>
          <p className="text-sm mt-1">Join a batch using an invite link from your trainer.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {sessions.sort((a,b)=>b.id-a.id).map((s) => {
            const active = isSessionActive(s);
            const attendanceStatus = markedSessions[s.id]; // ✅ from markedSessions

            return (
              <li key={s.id} className="border p-4 rounded-lg shadow-sm bg-white">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-base">{s.title}</p>
                    <p className="text-sm text-blue-600">Batch: {s.batch_name}</p>
                    <p className="text-sm text-gray-500">Trainer: {s.trainer_name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(s.date).toDateString()} &bull; {s.start_time} – {s.end_time}
                    </p>
                  </div>

                  <div className="ml-4 shrink-0">
                    {attendanceStatus === "present" ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        ✅ Present
                      </span>
                    ) : attendanceStatus === "absent" ? (
                      <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                        ❌ Absent
                      </span>
                    ) : active ? (
                      // session active, not yet marked — show button
                      <button
                        onClick={() => markAttendance(s.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700"
                      >
                        Mark Present
                      </button>
                    ) : (
                      // session ended, absent being marked in background
                      <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                        ❌ Absent
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default StudentDashboard;