const ROUTES = {
  ROOT: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  USERS: "/users",
  USER_CREATE: "/users/create",
  USER_MAP: "/users/map",
  USER_DETAILS: "/users/:id",
  USER_EDIT: "/users/:id/edit",
  USER_COMMUNITIES: "/users/:id/communities",
  USER_PAYMENTS: "/users/:id/payments",
  USER_RESOURCES: "/users/:id/resources",
  ORDERS: "/orders",
  ORDER_CREATE: "/orders/create",
  ORDER_DETAILS: "/orders/:id",
  ORDER_EDIT: "/orders/:id/edit",
  PAYMENTS: "/payments",
  PAYMENT_DETAILS: "/payments/:id",
  ADMINS: "/admins",
  SETTINGS: "/settings",
  USER_ACTIVITY: "/dashboard/user-activity",
} as const;

export default ROUTES;
