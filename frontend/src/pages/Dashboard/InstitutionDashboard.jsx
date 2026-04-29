import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAppAuth } from "../../context/AuthContext";

function InstitutionDashboard() {
  const { user } = useAppAuth();
  const [batches, setBatches] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [newBatchName, setNewBatchName] = useState("");
  const [modifyingBatch, setModifyingBatch] = useState(null);
  const [selectedTrainers, setSelectedTrainers] = useState([]);
  const [assigning, setAssigning] = useState(false);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (user?.institution_id) {
      fetchBatches();
      fetchTrainers();
    }
  }, [user]);

  const fetchBatches = async () => {
    try {
      const res = await api.get(`/institutions/${user.institution_id}/batches`);
      setBatches(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTrainers = async () => {
    try {
      const res = await api.get(`/users?role=trainer&institution_id=${user.institution_id}`);
      setTrainers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createBatch = async () => {
    if (!newBatchName.trim()) return alert("Enter batch name");
    try {
      const res = await api.post("/batches", {
        name: newBatchName,
        institution_id: user.institution_id,
      });
      setBatches((prev) => [res.data, ...prev]);
      setNewBatchName("");
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const openModify = (batch) => {
    setModifyingBatch(batch);
    setSelectedTrainers(batch.trainer_ids || []);
    setSummary(null);
  };

  const toggleTrainer = (id) => {
    setSelectedTrainers((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const assignTrainers = async () => {
    setAssigning(true);
    try {
      await api.post(`/batches/${modifyingBatch.id}/assign-trainers`, {
        trainer_ids: selectedTrainers,
      });
      setModifyingBatch(null);
      setSelectedTrainers([]);
      fetchBatches();
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setAssigning(false);
    }
  };

  const viewSummary = async (batchId) => {
    try {
      const res = await api.get(`/batches/${batchId}/summary`);
      setSummary({ batchId, data: res.data });
      setModifyingBatch(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Institution Dashboard</h1>

      {/* CREATE BATCH */}
      <div className="mb-8 border p-4 rounded-lg shadow-sm bg-white">
        <h2 className="text-lg font-semibold mb-3">Create New Batch</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={newBatchName}
            onChange={(e) => setNewBatchName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createBatch()}
            placeholder="Enter batch name"
            className="border px-3 py-2 rounded flex-1"
          />
          <button
            onClick={createBatch}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Create
          </button>
        </div>
      </div>

      {/* BATCH LIST */}
      <h2 className="text-lg font-semibold mb-3">Batches</h2>
      {batches.length === 0 ? (
        <p className="text-gray-500">No batches yet.</p>
      ) : (
        <ul className="space-y-3">
          {batches.map((batch) => (
            <li key={batch.id} className="border p-4 rounded-lg shadow-sm bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{batch.name}</p>
                  <p className="text-sm text-gray-500">
                    {batch.trainer_ids?.length
                      ? `${batch.trainer_ids.length} trainer(s) assigned`
                      : "No trainers assigned"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModify(batch)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                  >
                    Modify
                  </button>
                  <button
                    onClick={() => viewSummary(batch.id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Summary
                  </button>
                </div>
              </div>

              {/* ASSIGN TRAINERS PANEL */}
              {modifyingBatch?.id === batch.id && (
                <div className="mt-4 border-t pt-4">
                  <p className="font-medium mb-2">Assign Trainers</p>
                  {trainers.length === 0 ? (
                    <p className="text-gray-500 text-sm">No trainers in this institution.</p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
                      {trainers.map((t) => (
                        <label key={t.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedTrainers.includes(t.id)}
                            onChange={() => toggleTrainer(t.id)}
                          />
                          <span>{t.name}</span>
                          <span className="text-xs text-gray-400">{t.email}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={assignTrainers}
                      disabled={assigning}
                      className="px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-sm disabled:opacity-50"
                    >
                      {assigning ? "Assigning..." : "Assign"}
                    </button>
                    <button
                      onClick={() => setModifyingBatch(null)}
                      className="px-4 py-1.5 bg-gray-300 rounded hover:bg-gray-400 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* SUMMARY PANEL */}
              {summary?.batchId === batch.id && (
                <div className="mt-4 border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">Attendance Summary</p>
                    <button onClick={() => setSummary(null)} className="text-sm text-gray-500">✕</button>
                  </div>
                  {summary.data.length === 0 ? (
                    <p className="text-gray-500 text-sm">No sessions yet.</p>
                  ) : (
                    <table className="w-full border rounded text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border p-2 text-left">Session</th>
                          <th className="border p-2">Date</th>
                          <th className="border p-2">Present</th>
                          <th className="border p-2">Absent</th>
                        </tr>
                      </thead>
                      <tbody>
                        {summary.data.map((s) => (
                          <tr key={s.session_id} className="hover:bg-gray-50">
                            <td className="border p-2">{s.title}</td>
                            <td className="border p-2 text-center">{new Date(s.date).toDateString()}</td>
                            <td className="border p-2 text-center text-green-600">{s.present_count}</td>
                            <td className="border p-2 text-center text-red-500">{s.absent_count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default InstitutionDashboard;