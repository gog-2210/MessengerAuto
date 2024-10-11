const puppeteer = require("puppeteer");
const schedule = require("node-schedule");
const { setTimeout } = require("timers/promises");
require("dotenv").config();

const messages = [
    "Chúc mọi người luôn vui vẻ và tràn đầy năng lượng! Hãy làm cho ngày hôm nay thật đặc biệt!",
    "Chúc mọi người có một ngày làm việc hiệu quả! Mong rằng mọi nhiệm vụ sẽ thuận lợi và đạt kết quả tốt.",
    "Chúc các bạn luôn giữ được tinh thần lạc quan! Hãy nhìn về phía trước và đón nhận những điều tốt đẹp.",
    "Chúc mọi người sức khỏe và hạnh phúc! Mong rằng mọi người sẽ luôn mạnh khỏe và có những khoảnh khắc vui vẻ bên gia đình và bạn bè.",
    "Chúc mọi người thành công trong mọi dự định! Hãy theo đuổi ước mơ và không ngừng cố gắng nhé!",
    "Chúc các bạn một ngày tràn ngập niềm vui! Hãy dành thời gian cho những điều bạn yêu thích.",
    "Chúc mọi người luôn khám phá và học hỏi! Mỗi ngày là một cơ hội mới để phát triển.",
    "Chúc mọi người luôn yêu đời và có nhiều nụ cười! Hãy lan tỏa niềm vui đến mọi người xung quanh!",
    "Chúc các bạn có một ngày thật ý nghĩa và đầy cảm hứng!",
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
  await setTimeout(10000);
}

async function sendMessage(page, groupUrl, message) {
  try {
    await page.goto(groupUrl, { waitUntil: "networkidle2" });
    await page.waitForSelector('[aria-label="Tin nhắn"]', { timeout: 5000 }); // Thêm timeout

    // Nhập tin nhắn
    await page.type('[aria-label="Tin nhắn"]', message);
    await page.keyboard.press("Enter");
    await setTimeout(Math.random() * 2000 + 3000);
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
