import StudentDashboard from "../pages/Dashboard/StudentDashboard";
// const DashboardRouter = lazy(() => import("./pages/Dashboard/DashboardRouter"));
import TrainerDashboard from "../pages/Dashboard/TrainerDashboard";
import InstitutionDashboard from "../pages/Dashboard/InstitutionDashboard";
import ManagerDashboard from "../pages/Dashboard/ManagerDashboard";
import MonitoringOfficerDashboard from "../pages/Dashboard/MonitoringOfficerDashboard";

export const dashboardRoutes = [
  {
    path: "/student/dashboard",
    allowedRoles: ["student"],
    element: (
      <>
        <StudentDashboard />
      </>
    ),
  },
  {
    path: "/trainer/dashboard",
    allowedRoles: ["trainer"],
    element: (
      <>
        <TrainerDashboard />
      </>
    ),
  },
  {
    path: "/institution_admin/dashboard",
    allowedRoles: ["institution"],
    element: <InstitutionDashboard />,
  },
  {
    path: "/programme_manager/dashboard",
    allowedRoles: ["programme_manager"],
    element: <ManagerDashboard />,
  },
  {
    path: "/monitoring_officer/dashboard",
    allowedRoles: ["monitoring_officer"],
    element: <MonitoringOfficerDashboard />,
  },
];
