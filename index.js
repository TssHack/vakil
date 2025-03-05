const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const endpoint = "https://open.wiki-api.ir/apis-1/ChatGPT-4o?q=";

function sendResponse(res, status, message) {
    res.setHeader("Content-Type", "application/json");
    res.status(status).send(JSON.stringify({ status, message }, null, 2));
}

app.get("/", async (req, res) => {
    const text = req.query.text;

    if (!text) {
        sendResponse(res, 400, "Please enter text parameter");
        return;
    }

    // کدگذاری پارامتر 'text' برای ارسال در URL
    const encodedText = encodeURIComponent(`تو اکنون در نقش "وکیل مدافع" هستی. یک هوش مصنوعی متخصص در حقوق که به سؤالات قانونی پاسخ می‌دهد. تمامی پاسخ‌های تو باید بر اساس قوانین و مقررات معتبر کشور ایران باشد. مشخصات تو: - نام: وکیل مدافع - تخصص: حقوق، مشاوره قانونی، راهنمایی در دعاوی حقوقی و کیفری - زبان پاسخگویی: فارسی، به‌صورت حقوقی و دقیق - هدف تو: راهنمایی مراجعان در مسائل حقوقی و قانونی به‌طور دقیق و مستند - نام سازنده تو: احسان فضلی - توسعه یافته توسط تیم شفق ویژگی‌های پاسخ‌های تو: - تمامی پاسخ‌ها بر اساس قوانین ایران و نظرات مشاورین حقوقی معتبر است. - پاسخ‌ها باید قانونی، دقیق و مستند باشند. - از منابع معتبر قانونی مثل قوانین مدنی، کیفری، حقوق بشر و اصول دادرسی استفاده کن. - همیشه با احترام و ادب به مراجعان پاسخ بده. - در صورت نیاز به مشاوره تخصصی، مراجعان را به وکلای متخصص ارجاع بده. **اکنون به اولین سوال من پاسخ بده:** ${text}`);

    try {
        const response = await axios.get(endpoint + encodedText, {
            headers: {
                Accept: "application/json",  // اعلام اینکه می‌خواهیم پاسخ به صورت JSON دریافت کنیم
                "Accept-Language": "fa",     // زبان فارسی برای پاسخ
            },
        });

        // بررسی نتیجه برای اطمینان از موفقیت پاسخ
        if (response.data && response.data.results) {
            const result = response.data.results;
            sendResponse(res, 200, result);
        } else {
            sendResponse(res, 500, "Unexpected response structure");
        }
    } catch (error) {
        console.error("Error connecting to the API:", error);
        sendResponse(res, 500, "Error connecting to the API");
    }
});

app.listen(3000, () => {
    console.log("Dastiyar Momen API is running on port 3000");
});
