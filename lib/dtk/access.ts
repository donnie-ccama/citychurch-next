export type DtkRequestStatus = 'pending' | 'approved' | 'denied';

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Same format proxy.ts reads: a comma-separated list.
export function parseAdminEmails(raw: string | undefined): string[] {
  return (raw ?? '').split(',').map(normalizeEmail).filter(Boolean);
}

// Admins always see the kit. Everyone else needs an approved request.
// An empty admin list makes no one an admin.
export function canViewDtk(
  email: string | null | undefined,
  adminEmails: string[],
  status: DtkRequestStatus | null
): boolean {
  if (!email) return false;
  if (adminEmails.includes(normalizeEmail(email))) return true;
  return status === 'approved';
}
