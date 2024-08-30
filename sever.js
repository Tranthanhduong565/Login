const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const email = 'your-email@example.com';
const password = 'your-password';
const fileName = 'data.json';

async function loginAndGetData() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://www.facebook.com/login', { waitUntil: 'networkidle2' });
    await page.type('#email', email);
    await page.type('#pass', password);
    await page.click('[name="login"]');

    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    const cookies = await page.cookies();
    const appstate = await page.evaluate(() => {
        return 'fake-appstate'; // Thay đổi tùy theo cách bạn lấy giá trị thực tế
    });
    const token = await page.evaluate(() => {
        return 'fake-token'; // Thay đổi tùy theo cách bạn lấy giá trị thực tế
    });

    await browser.close();

    return {
        appstate: appstate,
        cookie: cookies,
        token: token,
    };
}

app.post('/api/login', async (req, res) => {
    try {
        const data = await loginAndGetData();

        fs.writeFileSync(fileName, JSON.stringify(data, null, 2));

        res.status(200).json({
            message: 'Dữ liệu đã được lưu vào file',
            data: data,
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi xảy ra', error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});
