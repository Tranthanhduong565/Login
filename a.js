const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true }); // Mở trình duyệt
  const page = await browser.newPage();

  // Truy cập vào URL của trang web
  await page.goto('https://gateway.golike.net');

  // Đợi một chút để trang tải xong
  await page.waitForTimeout(5000); // 5 giây, có thể thay đổi tùy thuộc vào tốc độ tải trang

  // Lấy token từ localStorage hoặc cookies
  const token = await page.evaluate(() => {
    // Lấy token từ localStorage (nếu có)
    const authToken = localStorage.getItem('authToken');
    if (authToken) return authToken;

    // Hoặc lấy token từ cookies (nếu có)
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      if (cookie.trim().startsWith('authToken=')) {
        return cookie.trim().split('=')[1];
      }
    }
    return null;
  });

  console.log('Authorization Token:', token);

  // Nếu lấy được token, bạn có thể sử dụng token này cho API request
  if (token) {
    // Gửi request đến API
    const axios = require('axios');
    try {
      const response = await axios.get('https://gateway.golike.net/api/tiktok-account', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-Agent': 'Mozilla/5.0',
        },
      });
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error in API request:', error.message);
    }
  }

  await browser.close();
})();
