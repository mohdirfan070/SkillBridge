import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAppAuth } from "../../context/AuthContext";

function TrainerDashboard() {
  const { user } = useAppAuth();
  const [batches, setBatches] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [newSession, setNewSession] = useState({
    batch_id: "",
    title: "",
    date: "",
    start_time: "",
    end_time: "",
  });
  const [attendance, setAttendance] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [inviteLinks, setInviteLinks] = useState({});

  useEffect(() => {
    if (user?.id) {
      api.get(`/batches/trainer/${user.id}`)
        .then((res) => setBatches(res.data))
        .catch((err) => console.error("Error fetching batches:", err));
      loadSessions();
    }
  }, [user]);

  const loadSessions = async () => {
    try {
      const res = await api.get("/sessions/my");
      setSessions(res.data);
    } catch (err) {
      console.error("Error fetching sessions:", err);
    }
  };

  const createSession = async () => {
    if (!newSession.batch_id || !newSession.title || !newSession.date || !newSession.start_time || !newSession.end_time) {
      return alert("Fill in all session details");
    }
    try {
      const res = await api.post("/sessions", newSession);
      setSessions((prev) => [res.data, ...prev]);
      setNewSession({ batch_id: "", title: "", date: "", start_time: "", end_time: "" });
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const viewAttendance = async (sessionId) => {
    try {
      const res = await api.get(`/sessions/${sessionId}/attendance`);
      setAttendance(res.data);
      setSelectedSessionId(sessionId);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  const generateInvite = async (batchId) => {
    try {
      const res = await api.post(`/batches/${batchId}/invite`);
      setInviteLinks((prev) => ({ ...prev, [batchId]: res.data.link }));
    } catch (err) {
      console.error("Error generating invite:", err);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-gray-800">Trainer Dashboard</h1>

      {/* Batches */}
      <section>
        <h2 className="text-xl font-semibold mb-4">My Batches</h2>
        {batches.length === 0 ? (
          <p className="text-gray-500">No batches assigned yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {batches.map((batch) => (
              <div key={batch.id} className="bg-white border rounded-lg shadow p-4">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-gray-700">{batch.name}</p>
                  <button
                    className="text-blue-600 text-sm hover:underline"
                    onClick={() => generateInvite(batch.id)}
                  >
                    Get Invite Link
                  </button>
                </div>
                {inviteLinks[batch.id] && (
                  <div className="mt-3 bg-gray-50 p-2 rounded text-sm">
                    <p className="font-medium mb-1">Share with students:</p>
                    <div className="flex items-center gap-2">
                      <span className="truncate">{inviteLinks[batch.id]}</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(inviteLinks[batch.id])}
                        className="text-blue-600 text-xs underline"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Create Session */}
      <section className="bg-white border rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Create New Session</h2>
        <div className="space-y-3">
          <select
            value={newSession.batch_id}
            onChange={(e) => setNewSession({ ...newSession, batch_id: e.target.value })}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="">-- Select Batch --</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Session title"
            value={newSession.title}
            onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
            className="border px-3 py-2 rounded w-full"
          />
          <input
            type="date"
            value={newSession.date}
            onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
            className="border px-3 py-2 rounded w-full"
          />
          <div className="flex gap-3">
            <input
              type="time"
              value={newSession.start_time}
              onChange={(e) => setNewSession({ ...newSession, start_time: e.target.value })}
              className="border px-3 py-2 rounded w-full"
            />
            <input
              type="time"
              value={newSession.end_time}
              onChange={(e) => setNewSession({ ...newSession, end_time: e.target.value })}
              className="border px-3 py-2 rounded w-full"
            />
          </div>
          <button
            onClick={createSession}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Create Session
          </button>
        </div>
      </section>

      {/* Sessions */}
      <section>
        <h2 className="text-xl font-semibold mb-4">My Sessions</h2>
        <div className="space-y-3">
          {sessions.sort((a,b)=>b.id - a.id).map((s) => (
            <div key={s.id} className="bg-white border rounded-lg shadow p-4">
              <p className="text-sm text-blue-600 font-medium">Batch: {s.batch_name}</p>
              <p className="font-semibold text-gray-800">{s.title}</p>
              <p className="text-sm text-gray-500">
                {new Date(s.date).toDateString()} • {s.start_time} – {s.end_time}
              </p>
              <button
                onClick={() => viewAttendance(s.id)}
                className="mt-2 px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
              >
                View Attendance
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Attendance */}
      {attendance.length > 0 && (
        <section className="bg-white border rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Attendance</h2>
            <button
              onClick={() => setAttendance([])}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ✕ Close
            </button>
          </div>
          <table className="w-full border rounded overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Student</th>
                <th className="border p-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((a) => (
                <tr key={a.student_id} className="hover:bg-gray-50">
                  <td className="border p-2">{a.name}</td>
                  <td className={`border p-2 text-center font-medium ${
                    a.status === "present" ? "text-green-600" : "text-red-500"
                  }`}>
                    {a.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

export default TrainerDashboard;
