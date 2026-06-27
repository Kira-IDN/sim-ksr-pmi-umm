import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Roles
  const roles = [
    'Admin Sistem',
    'Ketua Umum',
    'Wakil Ketua Umum',
    'Sekretaris',
    'Bendahara',
    'Pengurus Bidang',
    'Pengurus Kegiatan Lapangan',
    'Anggota Biasa',
    'Guest',
  ];

  const createdRoles: Record<string, string> = {};

  for (const roleName of roles) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
    createdRoles[roleName] = role.id;
  }
  
  // 2. Modules & Actions Mapping (Based on Architecture Lock & RBAC)
  const permissions = [
    // Dashboard & Profile
    { module: 'Dashboard', action: 'View' },
    { module: 'Profile', action: 'View' },
    { module: 'Profile', action: 'Edit' },
    
    // Data Anggota
    { module: 'Data Anggota', action: 'View' },
    { module: 'Data Anggota', action: 'Create' },
    { module: 'Data Anggota', action: 'Edit' },
    { module: 'Data Anggota', action: 'Delete' },
    
    // Struktur Organisasi
    { module: 'Struktur Organisasi', action: 'View' },
    { module: 'Struktur Organisasi', action: 'Manage' },
    
    // Arsip & Administrasi
    { module: 'Arsip & Administrasi', action: 'View' },
    { module: 'Arsip & Administrasi', action: 'Manage' },
    
    // Manajemen Kegiatan
    { module: 'Manajemen Kegiatan', action: 'View' },
    { module: 'Manajemen Kegiatan', action: 'Create' },
    { module: 'Manajemen Kegiatan', action: 'Edit' },
    { module: 'Manajemen Kegiatan', action: 'Delete' },
    
    // Approval
    { module: 'Approval', action: 'View' },
    { module: 'Approval', action: 'Approve' },
    
    // Inventaris
    { module: 'Inventaris', action: 'View' },
    { module: 'Inventaris', action: 'Manage' },
    
    // Keuangan
    { module: 'Keuangan', action: 'View' },
    { module: 'Keuangan', action: 'Manage' },
    
    // Data Pasien & Korban
    { module: 'Data Pasien & Korban', action: 'View' },
    { module: 'Data Pasien & Korban', action: 'Manage' },
  ];

  const createdPermissions: Record<string, string> = {};

  for (const p of permissions) {
    const perm = await prisma.permission.upsert({
      where: { module_action: { module: p.module, action: p.action } },
      update: {},
      create: p,
    });
    createdPermissions[`${p.module}:${p.action}`] = perm.id;
  }

  // 3. Assign Permissions to Roles (Simplified for Seeding based on rbac.ts)
  
  const rolePermissionsMap = [
    {
      role: 'Admin Sistem',
      perms: [
        'Dashboard:View', 'Profile:View', 'Profile:Edit',
        'Data Anggota:View', 'Data Anggota:Create', 'Data Anggota:Edit', 'Data Anggota:Delete',
        'Struktur Organisasi:View', 'Struktur Organisasi:Manage',
        'Arsip & Administrasi:View', 'Arsip & Administrasi:Manage',
        'Manajemen Kegiatan:View',
        'Approval:View',
        'Inventaris:View', 'Keuangan:View', 'Data Pasien & Korban:View'
      ]
    },
    {
      role: 'Ketua Umum',
      perms: [
        'Dashboard:View', 'Profile:View', 'Profile:Edit',
        'Data Anggota:View', 'Data Anggota:Edit',
        'Struktur Organisasi:View',
        'Manajemen Kegiatan:View', 'Manajemen Kegiatan:Create', 'Manajemen Kegiatan:Edit', 'Manajemen Kegiatan:Delete',
        'Approval:View', 'Approval:Approve',
        'Arsip & Administrasi:View', 'Inventaris:View', 'Keuangan:View'
      ]
    }
    // ... we can map other roles exactly as needed later dynamically via API.
    // For now, these are enough to test Admin & Ketua.
  ];

  for (const map of rolePermissionsMap) {
    const roleId = createdRoles[map.role];
    for (const permStr of map.perms) {
      const permId = createdPermissions[permStr];
      if (roleId && permId) {
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId, permissionId: permId } },
          update: {},
          create: { roleId, permissionId: permId }
        });
      }
    }
  }

  // 4. Create Default Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { nia: 'ADMIN001' },
    update: {},
    create: {
      loginId: 'ADMIN001',
      nia: 'ADMIN001',
      name: 'Administrator',
      passwordHash: adminPassword,
      roleId: createdRoles['Admin Sistem'],
      division: 'Administrasi Sistem',
      position: 'Admin Sistem'
    }
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
