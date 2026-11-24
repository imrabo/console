/**
 * Unified Design System - Theme Tokens
 *
 * Centralized design tokens for consistent UI/UX across the admin console.
 * Uses semantic names and follows existing Tailwind/shadcn conventions.
 */

// Colors - Semantic theme colors (dark mode default)
export const themeColors = {
  // Backgrounds
  background: 'bg-zinc-950',
  surface: 'bg-zinc-900',
  surfaceCard: 'bg-zinc-800/50',
  surfaceElevated: 'bg-zinc-800',

  // Text colors
  textPrimary: 'text-zinc-100',
  textSecondary: 'text-zinc-400',
  textMuted: 'text-zinc-500',
  textInverse: 'text-white',

  // Borders
  borderDefault: 'border-zinc-800',
  borderSubtle: 'border-zinc-700/30',
  borderFocus: 'focus:ring-zinc-600 focus:border-zinc-500',

  // Focus rings
  focusRing: 'focus:ring-2 focus:ring-zinc-600/40 focus:outline-none',

  // Spacing scale (in rem)
  spacing: {
    xs: '1rem', // 16px
    sm: '1.5rem', // 24px
    md: '2rem', // 32px
    lg: '2.5rem', // 40px
    xl: '3rem', // 48px
    '2xl': '3.5rem', // 56px
  },

  // Border radius scale
  borderRadius: {
    sm: '0.375rem', // 6px
    md: '0.5rem', // 8px
    lg: '0.75rem', // 12px
    xl: '1rem', // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },

  // Typography scale
  typography: {
    xs: 'text-[0.75rem]', // 12px
    sm: 'text-[0.875rem]', // 14px
    base: 'text-[1rem]', // 16px
    lg: 'text-[1.125rem]', // 18px
    xl: 'text-[1.25rem]', // 20px
    '2xl': 'text-[1.5rem]', // 24px
    '3xl': 'text-[1.875rem]', // 30px
    '4xl': 'text-[2.25rem]', // 36px
  },

  // Font weights
  fontWeight: {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
  },
};

// Button styles - Consistent across all pages
export const buttonStyles = {
  base: 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',

  variants: {
    default: {
      default: 'bg-zinc-900 text-zinc-50 shadow-sm hover:bg-zinc-800',
      outline: 'border border-input bg-transparent hover:bg-zinc-800 hover:text-zinc-100',
      ghost: 'hover:bg-zinc-800 hover:text-zinc-100',
    },
    primary: {
      default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90 h-8 px-4 py-1.5',
      outline:
        'border border-input bg-transparent shadow-sm hover:bg-zinc-800 hover:text-zinc-100 h-8 px-4 py-1.5',
      ghost: 'hover:bg-zinc-800 hover:text-zinc-100 h-8 px-3',
    },
    secondary: {
      default:
        'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-8 px-4 py-1.5',
      outline:
        'border border-input bg-transparent hover:bg-zinc-800 hover:text-zinc-100 h-8 px-4 py-1.5',
    },
    destructive: {
      default:
        'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 h-8 px-4 py-1.5',
      outline:
        'border border-input bg-transparent hover:bg-zinc-800 hover:text-destructive-foreground h-8 px-4 py-1.5',
    },
    ghost: {
      default: 'hover:bg-zinc-800 hover:text-zinc-100 h-8 px-3',
      outline:
        'border border-input bg-transparent hover:bg-zinc-800 hover:text-zinc-100 h-8 px-4 py-1.5',
    },
  },

  sizes: {
    sm: 'h-7 text-xs px-2.5 py-1.5',
    md: 'h-8 px-3',
    lg: 'h-9 px-4 py-2 text-base',
    icon: 'h-8 w-8 p-0',
  },
};

// Badge styles - Consistent across all pages
export const badgeStyles = {
  base: 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring/40',

  variants: {
    default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive:
      'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'text-zinc-400 border-zinc-700 hover:text-zinc-300',
  },

  statusColors: {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    inactive: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    warning: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    error: 'bg-red-500/10 text-red-400 border-red-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
};

// Card styles - Consistent across all pages
export const cardStyles = {
  base: 'rounded-xl border border-zinc-800 bg-zinc-900 shadow-sm',

  variants: {
    default: '',
    elevated: 'border-zinc-700/50 shadow-md',
    outlined: 'border-zinc-700 bg-transparent',
  },

  spacing: {
    padding: 'p-(--card-spacing)', // p-6
    paddingCompact: 'p-4',
    paddingXl: 'p-6 lg:p-8',
  },
};

// Input styles - Consistent across all pages
export const inputStyles = {
  base: 'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50',

  variants: {
    default: 'border-zinc-800 text-zinc-100 focus:border-zinc-500 focus:ring-zinc-600/40',
    outline:
      'border-zinc-700 bg-transparent hover:bg-zinc-800/50 focus:border-zinc-500 focus:ring-zinc-600/40',
  },

  label: {
    base: 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-100 mb-2',
    helper: 'text-xs text-zinc-500 mt-1.5',
    error: 'text-xs text-red-400 mt-1.5',
  },
};

// Table styles - Consistent across all pages
export const tableStyles = {
  base: 'w-full caption-bottom text-sm',

  thead: {
    base: 'table-thead [role="columnheader"] sticky top-0 z-10 bg-zinc-900/50 text-zinc-400 font-semibold',
    padding: 'px-4 py-3.5',
  },

  tbody: {
    base: 'table-tbody',
    row: 'border-b border-zinc-800/60 bg-zinc-900/30 hover:bg-zinc-800/50 transition-colors',
  },

  th: {
    padding: 'px-4 py-3.5 text-left align-middle',
  },

  td: {
    padding: 'px-4 py-3.5 text-left align-middle [&>div]:flex gap-2',
  },
};

// Dialog styles - Consistent across all pages
export const dialogStyles = {
  base: 'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-zinc-800 bg-zinc-900 p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-95 data-[state=closed]:slide-to-bottom-full data-[state=open]:zoom-in-95 data-[state=open]:slide-to-from-top-full',

  variants: {
    default: '',
    mobile: 'max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] overflow-y-auto',
  },
};

// Drawer styles - Consistent across all pages (mobile)
export const drawerStyles = {
  base: 'fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col justify-between border-r border-zinc-800 bg-zinc-900 shadow-lg',

  variants: {
    default: '',
    mobile: '', // Full screen on mobile
  },
};

// Page container styles - Consistent across all pages
export const pageContainerStyles = {
  base: 'mx-auto w-full max-w-[1400px]',
  padding: 'py-6 px-4 lg:px-8',
  contentPadding: 'mt-6 mb-6',
};

// Page header styles - Consistent across all pages
export const pageHeaderStyles = {
  base: 'mb-6 flex items-start justify-between gap-4',

  title: {
    mobile: 'text-xl font-semibold tracking-tight text-zinc-100 mb-2',
    tablet: 'text-2xl font-semibold tracking-tight text-zinc-100 mb-3',
    desktop: 'text-3xl font-bold tracking-tight text-zinc-100 mb-4',
  },

  description: {
    mobile: 'text-sm text-zinc-400 max-w-[75%]',
    tablet: 'text-base text-zinc-400 max-w-[80%]',
    desktop: 'text-lg text-zinc-400 max-w-[90%]',
  },
};

// Page toolbar styles - Consistent across all pages
export const pageToolbarStyles = {
  base: 'flex flex-col gap-3 sm:flex-row sm:items-center',

  actions: {
    mobile: 'flex-wrap gap-2 mt-2',
    tablet: 'gap-2',
    desktop: 'gap-3',
  },
};

// Search input styles - Consistent across all pages
export const searchInputStyles = {
  base: `relative flex items-center rounded-md border ${buttonStyles.variants.default.outline} bg-zinc-900/50 shadow-sm transition-colors focus-within:border-zinc-500 focus-within:ring-2 focus-within:ring-zinc-600/40`,

  input: {
    base: 'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
  },

  iconContainer: {
    base: 'absolute left-3 top-2.5 h-4 w-4 text-zinc-500',
  },
};

// Filter controls styles - Consistent across all pages
export const filterControlsStyles = {
  base: 'flex flex-wrap gap-2 mb-4',

  chip: {
    base: `inline-flex items-center rounded-full border ${buttonStyles.variants.default.outline} px-3 py-1 text-xs font-medium transition-colors hover:bg-zinc-800/50 cursor-pointer`,
    selected: 'bg-primary text-primary-foreground border-transparent',
  },
};

// Loading state styles - Consistent across all pages
export const loadingStateStyles = {
  spinner: {
    base: 'inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-700/30 border-t-primary',
  },

  skeleton: {
    base: 'animate-pulse rounded-md bg-zinc-800/50',
    compact: 'h-6 w-6',
    medium: 'h-10 w-full max-w-xs',
    large: 'h-24 w-full max-w-lg',
  },
};

// Error state styles - Consistent across all pages
export const errorStateStyles = {
  base: 'rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400',

  icon: {
    base: 'flex h-4 w-4 flex-shrink-0',
  },
};

// Empty state styles - Consistent across all pages
export const emptyStateStyles = {
  base: 'rounded-lg border border-zinc-800 bg-zinc-900/50 p-12 text-center',

  icon: {
    base: `flex h-16 w-16 items-center justify-center rounded-full ${buttonStyles.variants.default.outline} mb-4`,
  },

  title: {
    mobile: 'text-lg font-semibold text-zinc-200',
    tablet: 'text-xl font-semibold text-zinc-200',
    desktop: 'text-2xl font-semibold text-zinc-200',
  },

  description: {
    mobile: 'mt-2 text-sm text-zinc-500 max-w-[80%]',
    tablet: 'mt-3 text-base text-zinc-500 max-w-[90%]',
    desktop: 'mt-4 text-lg text-zinc-500',
  },
};

// Detail section styles - Consistent across all pages
export const detailSectionStyles = {
  base: 'space-y-3',

  label: {
    mobile: 'text-sm font-medium text-zinc-200 mb-1.5',
    tablet: 'text-sm font-medium text-zinc-200 mb-2',
    desktop: 'text-base font-semibold text-zinc-200 mb-3',
  },

  value: {
    mobile: 'text-sm text-zinc-400 break-all',
    tablet: 'text-sm text-zinc-400',
    desktop: 'text-base text-zinc-400',
  },
};

// Status badge styles - Consistent across all pages
export const statusBadgeStyles = {
  base: `inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badgeStyles.statusColors.active}`,

  variants: {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    inactive: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    warning: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    error: 'bg-red-500/10 text-red-400 border-red-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
};

// Responsive container widths - Consistent across all pages
export const responsiveContainerStyles = {
  mobile: 'w-full max-w-[calc(100%-1rem)] sm:max-w-[640px] lg:max-w-[800px]',
  tablet: 'max-w-[1024px]',
  desktop: 'max-w-[1200px]',
  wide: 'max-w-[1400px]',
};

// Image styles - Consistent across all pages
export const imageStyles = {
  responsive: `rounded-lg border ${buttonStyles.variants.default.outline} w-full object-cover`,

  sizes: {
    sm: 'h-24',
    md: 'h-64 lg:h-80',
    lg: 'h-[300px] lg:h-[400px]',
    xl: 'h-[500px]',
  },
};

// Form action styles - Consistent across all pages
export const formActionStyles = {
  mobile: 'flex flex-col gap-3 mt-6',
  tablet: 'flex justify-end gap-3 sm:flex-row',
  desktop: 'flex justify-end gap-3',
};

// Breadcrumb styles - Consistent across all pages
export const breadcrumbStyles = {
  base: 'flex items-center text-sm mb-4 text-zinc-500',

  link: {
    mobile: 'hover:text-zinc-300 transition-colors',
    tablet: 'hover:text-zinc-300 transition-colors',
    desktop: 'text-zinc-400 hover:text-zinc-200 transition-colors',
  },
};

// Environment banner styles - Consistent across all pages
export const envBannerStyles = {
  base: `fixed top-16 left-0 right-0 z-40 border ${buttonStyles.variants.default.outline} bg-zinc-900/80 backdrop-blur-sm px-4 py-2 text-xs text-zinc-500`,
};

// Export all styles for easy import
export const uiTokens = {
  ...themeColors,
  button: buttonStyles,
  badge: badgeStyles,
  card: cardStyles,
  input: inputStyles,
  table: tableStyles,
  dialog: dialogStyles,
  drawer: drawerStyles,
  pageContainer: pageContainerStyles,
  pageHeader: pageHeaderStyles,
  pageToolbar: pageToolbarStyles,
  searchInput: searchInputStyles,
  filterControls: filterControlsStyles,
  loadingState: loadingStateStyles,
  errorState: errorStateStyles,
  emptyState: emptyStateStyles,
  detailSection: detailSectionStyles,
  statusBadge: statusBadgeStyles,
  responsiveContainer: responsiveContainerStyles,
  image: imageStyles,
  formAction: formActionStyles,
  breadcrumb: breadcrumbStyles,
  envBanner: envBannerStyles,
};
