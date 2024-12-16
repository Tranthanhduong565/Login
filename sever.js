const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Gắn cookie
    const cookies = [
        { name: 'c_user', value: '100029977491749', domain: '.facebook.com' },
        // Thêm các cookie khác...
    ];
    await page.setCookie(...cookies);

    // Điều hướng đến Facebook
    await page.goto('https://www.facebook.com');

    // Chờ một chút và chụp màn hình
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'screenshot.png' });

    console.log('Đã hoàn thành!');
    await browser.close();
})();
