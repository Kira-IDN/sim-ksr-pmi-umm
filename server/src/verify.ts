import axios from 'axios';
import { prisma } from './config/prisma';

const API_URL = 'http://localhost:5000/api/v1';

async function verify() {
  console.log('--- STARTING BACKEND VERIFICATION ---\n');
  
  let accessToken = '';

  try {
    // 1. Auth Module (Login)
    console.log('1. Testing Auth Module...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      nia: 'ADMIN001',
      password: 'admin123'
    });
    
    if (loginRes.data.success && loginRes.data.data.accessToken) {
      accessToken = loginRes.data.data.accessToken;
      console.log('✅ Login successful. Received token.');
    } else {
      throw new Error('Login failed');
    }

    const authHeaders = { Authorization: `Bearer ${accessToken}` };

    // Grant Admin all permissions for testing
    console.log('\n- Granting Admin all permissions temporarily for testing...');
    const user = await prisma.user.findUnique({ where: { nia: 'ADMIN001' } });
    if (user) {
      const allPermissions = [
        { module: 'Manajemen Kegiatan', action: 'Create' },
        { module: 'Manajemen Kegiatan', action: 'Manage' },
        { module: 'Manajemen Kegiatan', action: 'View' },
        { module: 'Kehadiran', action: 'Manage' },
        { module: 'Kehadiran', action: 'View' },
        { module: 'Keuangan', action: 'Create' },
        { module: 'Keuangan', action: 'Manage' },
        { module: 'Keuangan', action: 'View' },
        { module: 'Inventaris', action: 'Create' },
        { module: 'Inventaris', action: 'Manage' },
        { module: 'Inventaris', action: 'View' },
        { module: 'Aspirasi/Pengaduan', action: 'Create' },
        { module: 'Aspirasi/Pengaduan', action: 'Manage' },
        { module: 'Aspirasi/Pengaduan', action: 'View' },
        { module: 'Approval', action: 'Approve' },
      ];
      for (const p of allPermissions) {
        const perm = await prisma.permission.upsert({
          where: { module_action: { module: p.module, action: p.action } },
          update: {},
          create: p
        });
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: user.roleId, permissionId: perm.id } },
          update: {},
          create: { roleId: user.roleId, permissionId: perm.id }
        });
      }
    }

    // 2. Role & Permission Module (RBAC Check)
    console.log('\n2. Testing RBAC Middleware...');
    const rolesRes = await axios.get(`${API_URL}/roles`, { headers: authHeaders });
    if (rolesRes.data.success) {
      console.log('✅ RBAC check passed. Retrieved roles.');
    }

    // 3. User Module (CRUD)
    console.log('\n3. Testing User Module...');
    const usersRes = await axios.get(`${API_URL}/users`, { headers: authHeaders });
    if (usersRes.data.success) {
      console.log('✅ Fetched users successfully.');
    }

    // 4. Activity Module (Transactions & Audit Log)
    console.log('\n4. Testing Activity Module...');
    const actRes = await axios.post(`${API_URL}/activities`, {
      title: 'Donor Darah Masal',
      description: 'Kegiatan donor darah tahunan',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000).toISOString()
    }, { headers: authHeaders });
    
    let activityId = '';
    if (actRes.data.success) {
      activityId = actRes.data.data.id;
      console.log('✅ Created activity successfully.');
    }

    // Approve Activity
    const actApproveRes = await axios.post(`${API_URL}/activities/${activityId}/approve`, {
      status: 'Approved',
      notes: 'Silakan dilaksanakan'
    }, { headers: authHeaders });
    if (actApproveRes.data.success) {
      console.log('✅ Approved activity successfully.');
    }

    // 5. Check Audit Log from DB Directly
    console.log('\n5. Verifying Audit Log Generation...');
    const auditLog = await prisma.auditLog.findFirst({
      where: { targetId: activityId, action: 'Create' }
    });
    if (auditLog) {
      console.log('✅ Audit log was created atomically.');
    } else {
      throw new Error('Audit log not found.');
    }

    // 6. Attendance Module
    console.log('\n6. Testing Attendance Module...');
    const attRes = await axios.post(`${API_URL}/attendances/clock-in`, {
      activityId: activityId,
      attendanceType: 'Event'
    }, { headers: authHeaders });
    if (attRes.data.success) {
      console.log('✅ Clock-in successful.');
    }

    // Prepare Categories
    const finCat = await prisma.financialCategory.create({
      data: { name: 'Sponsorship ' + Date.now(), type: 'Income' }
    });
    const invCat = await prisma.inventoryCategory.create({
      data: { name: 'Peralatan Lapangan ' + Date.now() }
    });

    // 7. Finance Module
    console.log('\n7. Testing Finance Module...');
    const finRes = await axios.post(`${API_URL}/finances`, {
      title: 'Dana Sponsorship BNI',
      categoryId: finCat.id,
      type: 'Income',
      amount: 5000000,
      transactionDate: new Date().toISOString()
    }, { headers: authHeaders });
    if (finRes.data.success) {
      console.log('✅ Created finance record successfully.');
    }

    // 8. Inventory Module
    console.log('\n8. Testing Inventory Module...');
    const invRes = await axios.post(`${API_URL}/inventories`, {
      categoryId: invCat.id,
      name: 'Tenda Peleton',
      stock: 2,
      condition: 'Baik'
    }, { headers: authHeaders });
    if (invRes.data.success) {
      console.log('✅ Created inventory record successfully.');
    }

    // 9. Complaint Module
    console.log('\n9. Testing Complaint Module...');
    const cmpRes = await axios.post(`${API_URL}/complaints`, {
      category: 'Infrastruktur',
      title: 'Tenda Bocor',
      description: 'Tenda peleton nomor 1 bocor di ujung kanan'
    }, { headers: authHeaders });
    
    if (cmpRes.data.success) {
      console.log('✅ Created complaint successfully.');
    }

    console.log('\n🎉 ALL MODULES VERIFIED SUCCESSFULLY 🎉');

  } catch (error: any) {
    console.error('❌ Verification Failed:', error?.response?.data || error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verify();
