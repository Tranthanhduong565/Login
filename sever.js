const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: true, // Chạy ở chế độ không hiển thị giao diện
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // Thêm các tham số nếu cần
    });
    const page = await browser.newPage();

    // Định nghĩa cookie từ dữ liệu đã cho
    const cookies = [
        { name: 'wd', value: '414x896', domain: '.facebook.com' },
        { name: 'datr', value: 'JPFfZ1R_TMUeUNo0r7HZOPNh', domain: '.facebook.com' },
        { name: 'dbln', value: '%7B%22100029977491749%22%3A%22g203elvL%22%7D', domain: '.facebook.com' },
        { name: 'ps_l', value: '1', domain: '.facebook.com' },
        { name: 'wl_cbv', value: 'v2%3Bclient_version%3A2697%3Btimestamp%3A1734358439', domain: '.facebook.com' },
        { name: 'xs', value: '33%3AjLwTin5_o6LVzw%3A2%3A1734340897%3A-1%3A6149', domain: '.facebook.com' },
        { name: 'fbl_st', value: '100626206%3BT%3A28905974', domain: '.facebook.com' },
        { name: 'sb', value: '5fBfZ1b816KNZWNmZJpbB2lU', domain: '.facebook.com' },
        { name: 'vpd', value: 'v1%3B730x414x3', domain: '.facebook.com' },
        { name: 'fr', value: '0LZ7ywsH1oTf2feNl.AWVktH7j69e9KbkkDA9OVBkTZJk.BnX_Dl..AAA.0.0.BnX_Eg.AWVly0oiSzI', domain: '.facebook.com' },
        { name: 'locale', value: 'vi_VN', domain: '.facebook.com' },
        { name: 'm_pixel_ratio', value: '3', domain: '.facebook.com' },
        { name: 'ps_n', value: '1', domain: '.facebook.com' },
        { name: 'c_user', value: '100029977491749', domain: '.facebook.com' },
    ];

    // Điều hướng đến trang Facebook và gắn cookie
    await page.setCookie(...cookies);
    await page.goto('https://www.facebook.com');

    // Chờ trang tải xong
    await page.waitForTimeout(5000);

    // Chụp màn hình để kiểm tra
    await page.screenshot({ path: 'screenshot.png' });

    console.log('Đăng nhập thành công, ảnh chụp màn hình đã được lưu!');

    // Đóng trình duyệt
    await browser.close();
})();
