const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/api/login/:email/:password/:2fa?', async (req, res) => {
  const { email, password, 2fa } = req.params;

  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Truy cập trang đăng nhập Facebook
    await page.goto('https://www.facebook.com/login');

    // Nhập thông tin đăng nhập
    await page.type('#email', email);
    await page.type('#pass', password);
    await page.click('button[name="login"]');

    // Chờ trang chính và xử lý 2FA nếu có
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    if (2fa) {
      // Xử lý 2FA nếu cần
      await page.type('input[name="approvals_code"]', 2fa);
      await page.click('button[name="approvals_code"]');
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
    }

    // Lấy cookies từ trình duyệt
    const cookies = await page.cookies();
    
    // Đóng trình duyệt
    await browser.close();

    // Lưu cookies vào file appState.json
    fs.writeFileSync('appState.json', JSON.stringify(cookies, null, 2));

    // Gửi cookies dưới dạng JSON
    res.json(cookies);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
