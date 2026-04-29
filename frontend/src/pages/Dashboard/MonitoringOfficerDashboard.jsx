import { useEffect, useState } from "react";
import api from "../../api/axios";

function MonitoringOfficerDashboard() {
  const [programmeSummary, setProgrammeSummary] = useState(null);
  const [institutions, setInstitutions] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [institutionBatches, setInstitutionBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [summaryRes, institutionsRes] = await Promise.all([
        api.get("/programme/summary"),
        api.get("/institutions"),
      ]);
      setProgrammeSummary(summaryRes.data);
      setInstitutions(institutionsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const viewInstitutionBatches = async (institution) => {
    try {
      const res = await api.get(`/institutions/${institution.id}/summary`);
      setInstitutionBatches(res.data);
      setSelectedInstitution(institution);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );

  const absent = programmeSummary
    ? Number(programmeSummary.total_attendance) - Number(programmeSummary.present)
    : 0;

  const pct =
    programmeSummary && Number(programmeSummary.total_attendance) > 0
      ? ((Number(programmeSummary.present) / Number(programmeSummary.total_attendance)) * 100).toFixed(1)
      : "N/A";

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Programme Manager Dashboard</h1>
      <p className="text-sm text-gray-500 mb-6">
        Overview of all institutions and attendance across the programme
      </p>

      {/* STATS CARDS */}
      {programmeSummary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border rounded-lg p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-blue-600">
              {programmeSummary.total_institutions}
            </p>
            <p className="text-sm text-gray-500 mt-1">Institutions</p>
          </div>
          <div className="bg-white border rounded-lg p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-purple-600">
              {programmeSummary.total_batches}
            </p>
            <p className="text-sm text-gray-500 mt-1">Batches</p>
          </div>
          <div className="bg-white border rounded-lg p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {programmeSummary.total_sessions}
            </p>
            <p className="text-sm text-gray-500 mt-1">Sessions</p>
          </div>
          <div className="bg-white border rounded-lg p-4 shadow-sm text-center">
            <p className={`text-2xl font-bold ${Number(pct) >= 75 ? "text-green-600" : "text-red-500"}`}>
              {pct}%
            </p>
            <p className="text-sm text-gray-500 mt-1">Attendance Rate</p>
          </div>
        </div>
      )}

      {/* ATTENDANCE BREAKDOWN */}
      {programmeSummary && (
        <div className="bg-white border rounded-lg p-4 shadow-sm mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">
              Present: <span className="text-green-600 font-medium">{programmeSummary.present}</span>
            </span>
            <span className="text-sm text-gray-500">
              Absent: <span className="text-red-500 font-medium">{absent}</span>
            </span>
            <span className="text-sm text-gray-500">
              Total: <span className="font-medium">{programmeSummary.total_attendance}</span>
            </span>
          </div>
          {pct !== "N/A" && (
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${Number(pct) >= 75 ? "bg-green-500" : "bg-red-500"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* INSTITUTIONS LIST */}
      <h2 className="text-lg font-semibold mb-3">Institutions</h2>
      {institutions.length === 0 ? (
        <p className="text-gray-500">No institutions found.</p>
      ) : (
        <ul className="space-y-3">
          {institutions.map((inst) => (
            <li key={inst.id} className="border rounded-lg shadow-sm bg-white">
              <div className="flex items-center justify-between p-4">
                <p className="font-semibold">{inst.name}</p>
                <button
                  onClick={() =>
                    selectedInstitution?.id === inst.id
                      ? setSelectedInstitution(null)
                      : viewInstitutionBatches(inst)
                  }
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  {selectedInstitution?.id === inst.id ? "Hide" : "View Batches"}
                </button>
              </div>

              {/* BATCH DETAIL — inline under institution */}
              {selectedInstitution?.id === inst.id && (
                <div className="border-t p-4">
                  {institutionBatches.length === 0 ? (
                    <p className="text-gray-500 text-sm">No batches found.</p>
                  ) : (
                    <table className="w-full border rounded text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border p-2 text-left">Batch</th>
                          <th className="border p-2">Students</th>
                          <th className="border p-2">Sessions</th>
                          <th className="border p-2">Present</th>
                          <th className="border p-2">Absent</th>
                          <th className="border p-2">Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {institutionBatches.map((b) => {
                          const bTotal =
                            Number(b.total_present) + Number(b.total_absent);
                          const bPct =
                            bTotal > 0
                              ? ((Number(b.total_present) / bTotal) * 100).toFixed(1)
                              : "N/A";
                          return (
                            <tr key={b.batch_id} className="hover:bg-gray-50">
                              <td className="border p-2 font-medium">{b.batch_name}</td>
                              <td className="border p-2 text-center">{b.total_students}</td>
                              <td className="border p-2 text-center">{b.total_sessions}</td>
                              <td className="border p-2 text-center text-green-600">{b.total_present}</td>
                              <td className="border p-2 text-center text-red-500">{b.total_absent}</td>
                              <td className="border p-2 text-center font-medium">
                                {bPct !== "N/A" ? (
                                  <span className={Number(bPct) >= 75 ? "text-green-600" : "text-red-500"}>
                                    {bPct}%
                                  </span>
                                ) : "N/A"}
                              </td>
                            </tr>
                          );
                        })}
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

export default MonitoringOfficerDashboard;