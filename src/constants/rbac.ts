// ============================================================
// SIM KSR PMI UMM — Role-Based Access Control (RBAC)
// Based on: Role Task Format (RTF) — Final Specification
// ============================================================

export type Role =
  | 'Admin Sistem'
  | 'Ketua Umum'
  | 'Wakil Ketua Umum'
  | 'Sekretaris'
  | 'Bendahara'
  | 'Pengurus Bidang'
  | 'Anggota Organisasi'
  | 'Pengurus Kegiatan Lapangan'
  | 'Guest';

export type Module =
  | 'Dashboard'
  | 'Data Anggota'
  | 'Struktur Organisasi'
  | 'Manajemen Kegiatan'
  | 'Absensi Digital'
  | 'Inventaris'
  | 'Data Pasien & Korban'
  | 'Keuangan'
  | 'Arsip & Administrasi'
  | 'Approval'
  | 'Laporan & Monitoring'
  | 'Form Pengaduan'
  | 'Rekap Laporan'
  | 'Buku Tamu Digital'
  | 'Peminjaman Barang'
  | 'Profil Saya'
  | 'Pengaturan';

// Granular permission levels per action
export type Permission = 'View' | 'Create' | 'Edit' | 'Delete' | 'CRUD' | 'Approve' | 'Export' | 'Full' | 'Manage' | 'Financial Approval';

// Module-level permission map per role
export type ModulePermission = {
  module: Module;
  permissions: Permission[];
};

// ============================================================
// MODULE ACCESS MAP
// Defines WHICH modules each role can access (for sidebar).
// ============================================================
export const ROLE_PERMISSIONS: Record<Role, Module[]> = {

  // ROLE 1 — Admin Sistem
  'Admin Sistem': [
    'Dashboard',
    'Data Anggota',
    'Struktur Organisasi',
    'Manajemen Kegiatan',
    'Arsip & Administrasi',
    'Approval',
    'Laporan & Monitoring',
    'Form Pengaduan',
    'Profil Saya',
    'Pengaturan',
  ],

  // ROLE 2 — Ketua Umum
  'Ketua Umum': [
    'Dashboard',
    'Data Anggota',
    'Struktur Organisasi',
    'Manajemen Kegiatan',
    'Absensi Digital',
    'Arsip & Administrasi',
    'Approval',
    'Laporan & Monitoring',
    'Form Pengaduan',
    'Profil Saya',
  ],

  // ROLE 3 — Wakil Ketua Umum
  'Wakil Ketua Umum': [
    'Dashboard',
    'Data Anggota',
    'Struktur Organisasi',
    'Manajemen Kegiatan',
    'Absensi Digital',
    'Approval',
    'Arsip & Administrasi',
    'Laporan & Monitoring',
    'Form Pengaduan',
    'Profil Saya',
  ],

  // ROLE 4 — Sekretaris
  'Sekretaris': [
    'Dashboard',
    'Struktur Organisasi',
    'Absensi Digital',
    'Arsip & Administrasi',
    'Rekap Laporan',
    'Laporan & Monitoring',
    'Form Pengaduan',
    'Profil Saya',
  ],

  // ROLE 5 — Bendahara
  'Bendahara': [
    'Dashboard',
    'Struktur Organisasi',
    'Absensi Digital',
    'Keuangan',
    'Approval',
    'Laporan & Monitoring',
    'Form Pengaduan',
    'Profil Saya',
  ],

  // ROLE 6 — Pengurus Bidang
  'Pengurus Bidang': [
    'Dashboard',
    'Struktur Organisasi',
    'Absensi Digital',
    'Inventaris',
    'Buku Tamu Digital',
    'Data Anggota',
    'Laporan & Monitoring',
    'Form Pengaduan',
    'Profil Saya',
  ],

  // ROLE 7 — Pengurus Kegiatan Lapangan
  'Pengurus Kegiatan Lapangan': [
    'Dashboard',
    'Manajemen Kegiatan',
    'Data Pasien & Korban',
    'Absensi Digital',
    'Laporan & Monitoring',
    'Form Pengaduan',
    'Profil Saya',
  ],

  // ROLE 8 — Anggota Organisasi
  'Anggota Organisasi': [
    'Dashboard',
    'Struktur Organisasi',
    'Absensi Digital',
    'Form Pengaduan',
    'Profil Saya',
  ],

  // ROLE 9 — Guest (external only)
  'Guest': [
    'Peminjaman Barang',
  ],
};

// ============================================================
// GRANULAR PERMISSION MAP
// Defines WHAT each role can do per module.
// Use this to show/hide action buttons inside pages.
// ============================================================
export const ROLE_ACTION_PERMISSIONS: Partial<Record<Role, Partial<Record<Module, Permission[]>>>> = {
  'Admin Sistem': {
    'Data Anggota':         ['CRUD'],
    'Struktur Organisasi':  ['CRUD'],
    'Manajemen Kegiatan':   ['View'],
    'Arsip & Administrasi': ['CRUD'],
    'Approval':             ['View'],
    'Laporan & Monitoring': ['Full', 'Export'],
    'Form Pengaduan':       ['Manage'],
    'Pengaturan':           ['Full'],
  },
  'Ketua Umum': {
    'Data Anggota':         ['View', 'Edit'],
    'Struktur Organisasi':  ['View'],
    'Manajemen Kegiatan':   ['View'],
    'Absensi Digital':      ['Create'],
    'Arsip & Administrasi': ['View'],
    'Approval':             ['Approve'],
    'Laporan & Monitoring': ['Full', 'Export'],
    'Form Pengaduan':       ['Create'],
  },
  'Wakil Ketua Umum': {
    'Data Anggota':         ['View', 'Edit'],
    'Struktur Organisasi':  ['View'],
    'Manajemen Kegiatan':   ['View'],
    'Absensi Digital':      ['Create'],
    'Approval':             ['Approve'],
    'Arsip & Administrasi': ['View'],
    'Laporan & Monitoring': ['Full'],
    'Form Pengaduan':       ['Create'],
  },
  'Sekretaris': {
    'Struktur Organisasi':  ['View'],
    'Absensi Digital':      ['Create'],
    'Arsip & Administrasi': ['CRUD'],
    'Rekap Laporan':        ['CRUD'],
    'Laporan & Monitoring': ['View'],
    'Form Pengaduan':       ['Create'],
  },
  'Bendahara': {
    'Struktur Organisasi':  ['View'],
    'Absensi Digital':      ['Create'],
    'Keuangan':             ['CRUD'],
    'Approval':             ['Financial Approval'],
    'Laporan & Monitoring': ['View', 'Export'],
    'Form Pengaduan':       ['Create'],
  },
  'Pengurus Bidang': {
    'Struktur Organisasi':  ['View'],
    'Absensi Digital':      ['Create'],
    'Inventaris':           ['CRUD'],
    'Buku Tamu Digital':    ['CRUD'],
    'Data Anggota':         ['CRUD'],
    'Laporan & Monitoring': ['View'],
    'Form Pengaduan':       ['Create'],
  },
  'Pengurus Kegiatan Lapangan': {
    'Manajemen Kegiatan':   ['CRUD'],
    'Data Pasien & Korban': ['CRUD'],
    'Absensi Digital':      ['Create'],
    'Laporan & Monitoring': ['View'],
    'Form Pengaduan':       ['Create'],
  },
  'Anggota Organisasi': {
    'Struktur Organisasi':  ['View'],
    'Absensi Digital':      ['Create'],
    'Form Pengaduan':       ['Create'],
  },
  'Guest': {
    'Peminjaman Barang':    ['Create', 'View'],
  },
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/** Check if a role has access to a module (for sidebar rendering) */
export const hasModuleAccess = (role: Role | null, module: Module): boolean => {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(module) ?? false;
};

/** Check if a role has a specific action permission on a module */
export const hasActionPermission = (
  role: Role | null,
  module: Module,
  action: Permission
): boolean => {
  if (!role) return false;
  const perms = ROLE_ACTION_PERMISSIONS[role]?.[module] ?? [];
  if (perms.includes('CRUD') && ['Create', 'Edit', 'Delete', 'View'].includes(action)) return true;
  if (perms.includes('Full') && action !== 'Delete') return true;
  return perms.includes(action);
};

/** Returns the list of permissions a role has for a given module */
export const getModulePermissions = (
  role: Role | null,
  module: Module
): Permission[] => {
  if (!role) return [];
  return ROLE_ACTION_PERMISSIONS[role]?.[module] ?? [];
};

/** Approval type differentiation */
export const canApproveGeneral = (role: Role | null): boolean =>
  ['Ketua Umum', 'Wakil Ketua Umum'].includes(role ?? '');

export const canApproveFinancial = (role: Role | null): boolean =>
  role === 'Bendahara';

export const canExport = (role: Role | null, module: Module): boolean => {
  return hasActionPermission(role, module, 'Export');
};

export const canManage = (role: Role | null, module: Module): boolean => {
  return hasActionPermission(role, module, 'Manage');
};

export const canViewReports = (role: Role | null): boolean => {
  return hasModuleAccess(role, 'Laporan & Monitoring');
};
