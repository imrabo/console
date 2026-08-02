import { createBrowserRouter, Navigate } from "react-router-dom";

// Layouts
import AdminLayout from "./components/layouts/AdminLayout";
import AuthLayout from "./components/layouts/AuthLayout";

// Auth
import LoginPage from "./features/auth/pages/LoginPage";

// Dashboard
import DashboardPage from "./features/dashboard/pages/DashboardPage";

// Profile
import ProfilePage from "./features/profile/pages/ProfilePage";

// Users
import UsersPage from "./features/users/pages/UsersPage";
import CreateUserPage from "./features/users/pages/CreateUserPage";
import EditUserPage from "./features/users/pages/EditUserPage";

// Organizations
import OrganizationsPage from "./features/organizations/pages/OrganizationsPage";
import OrganizationDetailsPage from "./features/organizations/pages/OrganizationDetailsPage";
import OrganizationEditPage from "./features/organizations/pages/OrganizationEditPage";

// Agents
import AgentsPage from "./features/agents/pages/AgentsPage";

// Memory
import MemoryPage from "./features/memory/pages/MemoryPage";

// Connectors
import ConnectorsPage from "./features/connectors/pages/ConnectorsPage";
import CreateConnectorPage from "./features/connectors/pages/CreateConnectorPage";

// Notifications
import NotificationsPage from "./features/notifications/pages/NotificationsPage";

// Payments
import PaymentsPage from "./features/payments/pages/PaymentsPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },

  {
    path: "/",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },

      {
        path: "profile",
        element: <ProfilePage />,
      },

      {
        path: "users",
        children: [
          {
            index: true,
            element: <UsersPage />,
          },
          {
            path: "create",
            element: <CreateUserPage />,
          },
          {
            path: ":id/edit",
            element: <EditUserPage />,
          },
        ],
      },

      {
        path: "organizations",
        children: [
          {
            index: true,
            element: <OrganizationsPage />,
          },
          {
            path: ":id",
            element: <OrganizationDetailsPage />,
          },
          {
            path: ":id/edit",
            element: <OrganizationEditPage />,
          },
        ],
      },

      {
        path: "agents",
        element: <AgentsPage />,
      },

      {
        path: "memory",
        element: <MemoryPage />,
      },

      {
        path: "connectors",
        children: [
          {
            index: true,
            element: <ConnectorsPage />,
          },
          {
            path: "create",
            element: <CreateConnectorPage />,
          },
        ],
      },

      {
        path: "notifications",
        element: <NotificationsPage />,
      },

      {
        path: "payments",
        element: <PaymentsPage />,
      },
    ],
  },

  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
