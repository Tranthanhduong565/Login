const express = require('express');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.json());

// API endpoint nhận thông tin đăng nhập và xử lý login
app.post('/api/login/:email/:password/:twofa?', async (req, res) => {
    const { email, password, twofa } = req.params;

    try {
        const appstate = await loginAndSendAppState(email, password, twofa);
        res.status(200).json({
            message: 'Đăng nhập thành công',
            appstate: appstate,
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi xảy ra', error: error.message });
    }
});

// Hàm đăng nhập vào Facebook và gửi appstate
async function loginAndSendAppState(email, password, twofa) {
    const browser = await puppeteer.launch({ headless: false }); // Chạy trình duyệt không headless để dễ theo dõi
    const page = await browser.newPage();

    await page.goto('https://www.facebook.com/login', { waitUntil: 'networkidle2' });

    await page.type('#email', email);
    await page.type('#pass', password);
    await page.click('[name="login"]');

    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // Nếu có mã 2FA, xử lý
    if (twofa) {
        await page.waitForSelector('input[name="approvals_code"]', { timeout: 10000 });
        await page.type('input[name="approvals_code"]', twofa);
        await page.click('[name="checkpointSubmitButton"]');
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
    }

    // Lấy giá trị appstate từ trang (giá trị giả ở đây)
    const appstate = await page.evaluate(() => {
        // Thay đổi tùy theo cách bạn lấy giá trị thực tế
        return window.appStateVariable ? window.appStateVariable : 'Không tìm thấy appstate';
    });

    await browser.close();

    // Gửi appstate đến server khác nếu cần
    await fetch('http://localhost:3000/api/receive-appstate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appstate }),
    });

    return appstate;
}

// Endpoint nhận dữ liệu appstate
app.post('/api/receive-appstate', (req, res) => {
    const { appstate } = req.body;

    if (appstate) {
        console.log('Nhận được appstate:', appstate);
        res.status(200).json({ message: 'Dữ liệu đã nhận thành công' });
    } else {
        res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});
