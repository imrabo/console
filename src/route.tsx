import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useLocation,
  useParams,
} from "react-router-dom";

import { QueryClientProvider } from "@tanstack/react-query";

import ROUTES from "@/constants/routes";

import { AdminUsersPage } from "@/features/admins/pages/AdminUsersPage";
import SettingsPage from "@/features/settings/pages/SettingsPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import { useAuth } from "@/providers/AuthProvider";

import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";

import { OrdersPage } from "@/features/orders/pages/OrdersPage";
import { OrderDetailsPage } from "@/features/orders/pages/OrderDetailsPage";
import { CreateOrderPage } from "@/features/orders/pages/CreateOrderPage";
import { EditOrderPage } from "@/features/orders/pages/EditOrderPage";
import { useOrderQuery } from "@/features/orders/hooks/useOrders";

import { PaymentsPage } from "@/features/payments/pages/PaymentsPage";
import PaymentDetailsPage from "@/features/payments/pages/PaymentDetailsPage";

import { UsersPage } from "@/features/users/pages/UsersPage";
import { UsersMapPage } from "@/features/users/pages/UsersMapPage";
import CreateUserPage from "@/features/users/pages/CreateUserPage";
import EditUserPage from "@/features/users/pages/EditUserPage";
import { UserDetailsPage } from "@/features/users/pages/UserDetailsPage";
import { useUserQuery } from "@/features/users/hooks/useUsers";

import { createQueryClient } from "@/providers/query-client";
import AdminLayout from "@/components/layouts/AdminLayout";
import { ToolTipProvider } from "./providers/ToolTipProvider";
import AuthProvider from "./providers/AuthProvider";

const queryClient = createQueryClient();

// Query provider

function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToolTipProvider>
          <Outlet />
        </ToolTipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

// User details route
function UserDetailRoute() {
  const { id = "" } = useParams();

  const { data, isLoading, isError } = useUserQuery(id);

  if (isLoading) {
    return <p className="p-6">Loading user...</p>;
  }

  if (isError || !data) {
    return <p className="p-6">User not found.</p>;
  }

  return <UserDetailsPage user={data} />;
}

// Order details route
function OrderDetailRoute() {
  const { id = "" } = useParams();

  const { data, isLoading, isError } = useOrderQuery(id);

  if (isLoading) {
    return <p className="p-6">Loading order...</p>;
  }

  if (isError || !data) {
    return <p className="p-6">Order not found.</p>;
  }

  return <OrderDetailsPage order={data} />;
}

function ProtectedAdminLayout() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading session...</div>;
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <AdminLayout />;
}

// Browser router
export const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      children: [
        {
          path: ROUTES.ROOT,
          element: <Navigate to={ROUTES.DASHBOARD} replace />,
        },
        {
          path: ROUTES.LOGIN,
          element: <LoginPage />,
        },
        {
          element: <ProtectedAdminLayout />,
          children: [
            {
              path: ROUTES.DASHBOARD,
              element: <DashboardPage />,
            },

            // Users
            {
              path: ROUTES.USERS,
              element: <UsersPage />,
            },
            {
              path: ROUTES.USER_MAP,
              element: <UsersMapPage />,
            },
            {
              path: ROUTES.USER_CREATE,
              element: <CreateUserPage />,
            },
            {
              path: ROUTES.USER_DETAILS,
              element: <UserDetailRoute />,
            },
            {
              path: ROUTES.USER_EDIT,
              element: <EditUserPage />,
            },

            // Orders
            {
              path: ROUTES.ORDERS,
              element: <OrdersPage />,
            },
            {
              path: ROUTES.ORDER_CREATE,
              element: <CreateOrderPage />,
            },
            {
              path: ROUTES.ORDER_DETAILS,
              element: <OrderDetailRoute />,
            },
            {
              path: ROUTES.ORDER_EDIT,
              element: <EditOrderPage />,
            },

            // Payments
            {
              path: ROUTES.PAYMENTS,
              element: <PaymentsPage />,
            },
            {
              path: ROUTES.PAYMENT_DETAILS,
              element: <PaymentDetailsPage />,
            },

            // Admins and settings
            {
              path: ROUTES.ADMINS,
              element: <AdminUsersPage />,
            },
            {
              path: ROUTES.SETTINGS,
              element: <SettingsPage />,
            },
          ],
        },

        // Not found
        {
          path: "*",
          element: <Navigate to={ROUTES.DASHBOARD} replace />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL.replace(/\/$/, ""),
  },
);

// Application router provider
export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
