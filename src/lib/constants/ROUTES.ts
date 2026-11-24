export const ROUTES = {
  LOGIN: '/login',

  DASHBOARD: '/',

  USERS: '/users',
  USER_DETAILS: (id: string) => `/users/${id}`,

  VILLAGES: '/communities',
  VILLAGE_DETAILS: '/communities/:id',


  FEED: '/feed',

  MEETUPS: '/meetups',
  MEETUP_DETAILS: '/meetups/:id',

  WEBINARS: '/webinars',

  RESOURCES: '/resources',

  MEMBERSHIPS: '/memberships',

  COINS: '/coins',

  NOTIFICATIONS: '/notifications',

  MODERATION: '/moderation',

  ANALYTICS: '/analytics',

  SETTINGS: '/settings',
} as const;
