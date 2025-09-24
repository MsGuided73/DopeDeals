// This file is deprecated - use requireAdmin from requireAuth.ts instead
import { requireAdmin as newRequireAdmin } from './requireAuth';

/**
 * @deprecated Use requireAdmin from './requireAuth' instead
 */
export async function requireAdmin() {
  return newRequireAdmin();
}
