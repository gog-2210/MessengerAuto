const puppeteer = require("puppeteer");
const schedule = require("node-schedule");
const { setTimeout } = require("timers/promises");
require("dotenv").config();

const messages = [
    "Chúc mọi người ngày mới luôn vui vẻ và tràn đầy năng lượng!",
    "Chúc mọi người có một ngày làm việc hiệu quả! Mong rằng mọi thứ sẽ thuận lợi và đạt kết quả tốt.",
    "Chúc ae  một ngày mới tràn đầy niềm vui và hạnh phúc! Làm gì thì làm nhớ giữ gìn sức khỏe nhé ae.",
    "Chúc mọi người ngày mới nhiều sức khỏe, hạnh phúc! Và có những khoảnh khắc vui vẻ bên gia đình.",
    "Chúc mọi người ngày mới luôn thành công trong mọi dự định!",
    "Chúc ae một ngày tràn ngập niềm vui! Hãy dành thời gian cho những điều bạn yêu thích.",
    "Chúc mọi người luôn yêu đời và có nhiều nụ cười! ngày mới tốt lành nhé!",
    "Chúc ae có một ngày thật ý nghĩa và đầy cảm hứng!",
    "Chúc mọi người luôn tìm thấy hạnh phúc trong từng khoảnh khắc nhỏ bé!"
];

async function loginToMessenger(page, username, password) {
  await page.goto("https://www.messenger.com/", { waitUntil: "networkidle2" });

  // Nhập email và password
  await page.type('input[name="email"]', username);
  await page.type('input[name="pass"]', password);

  // Submit form
  await page.click('button[name="login"]');

  // Thay thế page.waitFor bằng page.waitForTimeout
  await setTimeout(6000);
}

async function sendMessage(page, groupUrl, message) {
  try {
    await page.goto(groupUrl, { waitUntil: "networkidle2" });
    await page.waitForSelector('[aria-label="Tin nhắn"]', { timeout: 5000 }); // Thêm timeout

    // Nhập tin nhắn
    await page.type('[aria-label="Tin nhắn"]', message);
    await page.keyboard.press("Enter");
    await setTimeout(Math.random() * 5000 + 10000);
    console.log("Message sent: ", message);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

async function job() {
  const username = process.env.EMAIL;
  const password = process.env.PASSWORD;
  const groupUrl = process.env.GROUP_URL; // Đường dẫn nhóm chat

  const browser = await puppeteer.launch({ headless: true }); // Sử dụng headless: false để xem hoạt động
  const page = await browser.newPage();

  try {
    await loginToMessenger(page, username, password);

    // Random tin nhắn
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    await sendMessage(page, groupUrl, randomMessage);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await browser.close();
  }
}

job();
// Đặt lịch gửi tin nhắn mỗi phút
// schedule.scheduleJob('*/1 * * * *', job);
