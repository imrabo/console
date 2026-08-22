import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react"

import type { UserType } from "@/features/users"

import { authService } from "@/features/auth/services/authService"

import { setAccessToken, clearAccessToken } from "@/lib/api/client"

import { useAuthStore } from "@/lib/store/authStore"

// =====================================================
// AUTH CONTEXT TYPE
// =====================================================

export interface AuthContextType {
  /**
   * Currently authenticated user.
   */
  user: UserType | null

  /**
   * Whether the user is authenticated.
   */
  isAuthenticated: boolean

  /**
   * Whether authentication state is being initialized
   * or an authentication operation is in progress.
   */
  isLoading: boolean

  /**
   * Login user.
   *
   * Access token is stored in memory.
   * Refresh token is managed by HttpOnly cookie.
   */
  login: (username: string, password: string) => Promise<UserType | null>

  /**
   * Logout current user.
   */
  logout: () => Promise<void>

  /**
   * Explicitly refresh the current user from backend.
   *
   * This does NOT run automatically on every route change.
   */
  refreshUser: () => Promise<void>
}

// =====================================================
// CONTEXT
// =====================================================

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// =====================================================
// PROVIDER PROPS
// =====================================================

interface AuthProviderProps {
  children: ReactNode
}

// =====================================================
// AUTH PROVIDER
// =====================================================

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, isLoading, setUser, setLoading } = useAuthStore()

  // =====================================================
  // INITIALIZE AUTHENTICATION
  // =====================================================

  const initializeAuth = useCallback(async () => {
    setLoading(true)

    try {
      /*
       * IMPORTANT
       *
       * The access token is memory-only.
       *
       * After a full browser refresh:
       *
       *     accessToken = null
       *
       * But the refresh token still exists inside
       * the HttpOnly cookie.
       *
       * The Axios client should handle:
       *
       *     /me
       *       ↓
       *     401
       *       ↓
       *     /auth-user/refresh
       *       ↓
       *     HttpOnly refresh cookie
       *       ↓
       *     new access token
       *       ↓
       *     retry /me
       *
       * Therefore we only call /me once during the
       * initial application authentication check.
       */

      const response = await authService.getCurrentUser()

      const currentUser = response.data || null

      /*
       * Store authenticated user in memory/state.
       */

      setUser(currentUser)
    } catch {
      /*
       * If both:
       *
       * /me
       *
       * and
       *
       * /refresh
       *
       * fail, the authentication session is invalid.
       */

      clearAccessToken()

      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [setLoading, setUser])

  // =====================================================
  // INITIAL AUTH CHECK
  // =====================================================

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  // =====================================================
  // LOGIN
  // =====================================================

  const login = useCallback(
    async (username: string, password: string): Promise<UserType | null> => {
      setLoading(true)

      try {
        /*
         * Send login request.
         *
         * Backend returns:
         *
         *     access_token
         *     user
         *
         * Backend also sets:
         *
         *     refresh_token
         *
         * as an HttpOnly cookie.
         */

        const response = await authService.login({
          username,
          password,
        })

        // -------------------------------------------------
        // Access token
        // -------------------------------------------------

        const accessToken = response.data?.accessToken

        if (!accessToken) {
          throw new Error("Login succeeded but no access token was returned.")
        }

        /*
         * Store access token in memory.
         *
         * DO NOT store the refresh token.
         *
         * DO NOT read the refresh token.
         *
         * The browser manages the HttpOnly cookie.
         */

        setAccessToken(accessToken)

        // -------------------------------------------------
        // User
        // -------------------------------------------------

        const loggedInUser = response.data?.fullName || null

        if (!loggedInUser) {
          /*
           * If your login endpoint does not return the user,
           * you can explicitly call refreshUser() here.
           *
           * But if your goal is to avoid /me after login,
           * the login endpoint should return the user.
           */

          throw new Error("Login succeeded but no user was returned.")
        }

        /*
         * Store user in auth store.
         *
         * Dashboard and other protected routes can now
         * use this state without calling /me.
         */

        setUser(loggedInUser)

        return loggedInUser
      } catch (error) {
        /*
         * Login failed.
         *
         * Clear both frontend authentication state
         * and in-memory access token.
         */

        clearAccessToken()

        setUser(null)

        throw error
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setUser]
  )

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true)

    try {
      /*
       * Backend logout should clear the HttpOnly
       * refresh-token cookie.
       */

      await authService.logout()
    } finally {
      /*
       * Always clear the frontend access token.
       */

      clearAccessToken()

      /*
       * Clear authenticated user.
       */

      setUser(null)

      setLoading(false)
    }
  }, [setLoading, setUser])

  // =====================================================
  // REFRESH CURRENT USER
  // =====================================================

  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      /*
       * This is an EXPLICIT operation.
       *
       * It does not automatically run when navigating
       * between dashboard routes.
       *
       * Example:
       *
       *     await refreshUser()
       *
       * If the access token has expired, Axios should
       * automatically perform:
       *
       *     401
       *       ↓
       *     /refresh
       *       ↓
       *     new access token
       *       ↓
       *     retry /me
       */

      const response = await authService.getCurrentUser()

      const currentUser = response.data || null

      setUser(currentUser)
    } catch {
      /*
       * If refresh fails, consider the session invalid.
       */

      clearAccessToken()

      setUser(null)
    }
  }, [setUser])

  // =====================================================
  // AUTHENTICATION STATE
  // =====================================================

  const isAuthenticated = Boolean(user)

  // =====================================================
  // CONTEXT VALUE
  // =====================================================

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      refreshUser,
    }),
    [user, isAuthenticated, isLoading, login, logout, refreshUser]
  )

  // =====================================================
  // PROVIDER
  // =====================================================

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// =====================================================
// DEFAULT EXPORT
// =====================================================

export default AuthProvider
