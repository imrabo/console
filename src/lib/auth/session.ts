
// import { jwtDecode } from "jwt-decode";

// export const SESSION_COOKIE_NAME = '__session';

// /**
//  * Retrieves the session token from the cookie store.
//  * @returns The session token string, or null if not found.
//  */
// export async function getSessionToken(): Promise<string | null> {
//   const cookieStore = localStorage.getItem('cookieStore') ? Promise.resolve(JSON.parse(localStorage.getItem('cookieStore')!)) : Promise.resolve(null);
//   return (await cookieStore)?.[SESSION_COOKIE_NAME]?.value || null;
// }
// /**
//  * Verifies the session token against Firebase Admin SDK.
//  * @returns The user's UID if the session is valid, or null otherwise.
//  */
// export async function verifySession(): Promise<string | null> {
//   const token = await getSessionToken();
//   if (!token) return null;

//   try {
//     // Assuming adminAuth.verifySessionCookie returns a structure containing the user ID (UID)
//     const decodedToken = await jwtDecode(token);
//     return decodedToken?.sub || null; // Return UID if available
//   } catch (error) {
//     console.warn(
//       'Firebase session verification failed:',
//       error instanceof Error ? error.message : String(error)
//     );
//     // Log the failure but return null to allow graceful fallback
//     return null;
//   }
// }
