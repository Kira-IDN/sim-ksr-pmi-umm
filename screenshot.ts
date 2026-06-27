import { chromium } from 'playwright';
import path from 'path';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  
  const artifactDir = 'C:\\Users\\abras\\.gemini\\antigravity\\brain\\f82d0371-de53-459e-bf5c-a349b57ef548';
  
  console.log('Navigating to login...');
  await page.goto('http://localhost:5173/login');
  await page.waitForTimeout(2000); // Wait for animations
  
  console.log('Taking login screenshot...');
  await page.screenshot({ path: path.join(artifactDir, 'screenshot_login.png') });
  
  console.log('Logging in...');
  await page.fill('input[name="nia"]', 'ADMIN001');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button[type="submit"]');
  
  console.log('Waiting for dashboard load...');
  await page.waitForTimeout(4000); 
  
  console.log('Taking dashboard screenshot...');
  await page.screenshot({ path: path.join(artifactDir, 'screenshot_dashboard.png') });
  
  const modules = [
    { name: 'Anggota', url: '/anggota' },
    { name: 'Kegiatan', url: '/kegiatan' },
    { name: 'Absensi', url: '/absensi' },
    { name: 'Inventaris', url: '/inventaris' },
    { name: 'Keuangan', url: '/keuangan' },
    { name: 'Pengaduan', url: '/pengaduan' },
  ];
  
  for (const mod of modules) {
    console.log(`Navigating to ${mod.name}...`);
    await page.goto(`http://localhost:5173${mod.url}`);
    await page.waitForTimeout(2000); // Wait for React Query to load data
    await page.screenshot({ path: path.join(artifactDir, `screenshot_${mod.name.toLowerCase()}.png`) });
  }
  
  await browser.close();
  console.log('Done!');
})();
