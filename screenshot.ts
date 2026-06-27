import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  
  const artifactDir = path.join(process.cwd(), 'docs', 'assets');
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }
  
  try {
    console.log('Navigating to login...');
    await page.goto('http://localhost:5173/login');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(artifactDir, 'screenshot_login.png') });
    
    console.log('Logging in...');
    await page.fill('input[name="nia"]', 'ADMIN001');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    console.log('Waiting for dashboard load...');
    await page.waitForTimeout(4000); 
    await page.screenshot({ path: path.join(artifactDir, 'screenshot_dashboard.png') });

    // Toggle Dark Mode
    console.log('Toggling dark mode...');
    await page.evaluate(() => {
      localStorage.setItem('theme-storage', JSON.stringify({ state: { darkMode: true }, version: 0 }));
    });
    await page.reload();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(artifactDir, 'screenshot_dark_mode.png') });
    
    // Toggle back to light mode
    await page.evaluate(() => {
      localStorage.setItem('theme-storage', JSON.stringify({ state: { darkMode: false }, version: 0 }));
    });
    await page.reload();
    await page.waitForTimeout(2000);

    // Sidebar Closed (default)
    await page.screenshot({ path: path.join(artifactDir, 'screenshot_sidebar_closed.png') });
    
    // Sidebar Open
    console.log('Testing open sidebar...');
    // The hamburger menu is a button in the header containing lucide-menu
    await page.click('header button:has(svg.lucide-menu)'); 
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(artifactDir, 'screenshot_sidebar_open.png') });
    
    // Close it again for the rest of the screenshots
    await page.click('header button:has(svg.lucide-menu)');
    await page.waitForTimeout(1000);
    
    // Profile
    console.log('Navigating to Profile...');
    await page.goto('http://localhost:5173/profil');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(artifactDir, 'screenshot_profile.png') });

    // Pengaturan
    console.log('Navigating to Pengaturan...');
    await page.goto('http://localhost:5173/pengaturan');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(artifactDir, 'screenshot_pengaturan.png') });
    
    // Data Anggota
    console.log('Navigating to Data Anggota...');
    await page.goto('http://localhost:5173/anggota');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(artifactDir, 'screenshot_anggota.png') });
    
    // Detail Anggota (Click on Edit button of first row)
    console.log('Opening Detail Anggota Modal...');
    try {
      // In the new data table, the edit/detail button might be in the actions column.
      // Usually it's a button with a Pen, Eye, or similar icon.
      const actionButton = await page.waitForSelector('table tbody tr:first-child td button', { timeout: 3000 });
      if (actionButton) {
        await actionButton.click();
        await page.waitForTimeout(1500);
        await page.screenshot({ path: path.join(artifactDir, 'screenshot_detail_anggota.png') });
        // Close modal
        await page.click('button:has(svg.lucide-x)');
        await page.waitForTimeout(500);
      }
    } catch (e) {
      console.log('Could not open detail anggota modal', e.message);
    }

    // Responsive Mobile
    console.log('Switching to mobile viewport...');
    const mobileContext = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto('http://localhost:5173/dashboard');
    // Ensure logged in in new context by passing localStorage or just relogin
    await mobilePage.goto('http://localhost:5173/login');
    await mobilePage.fill('input[name="nia"]', 'ADMIN001');
    await mobilePage.fill('input[name="password"]', 'admin123');
    await mobilePage.click('button[type="submit"]');
    await mobilePage.waitForTimeout(3000);
    await mobilePage.screenshot({ path: path.join(artifactDir, 'screenshot_responsive_mobile.png') });
    
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
    console.log('Done!');
  }
})();
