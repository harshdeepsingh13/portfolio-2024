const axios = require("axios");
const nodemailer = require("nodemailer");
const { userTrackerEmail } = require("../emailTemplates");
const moment = require("moment");

const ipVisitCache = new Map();

const DEBOUNCE_MINUTES = 2;

const isLocalHost = (ip) => {
  return ["::1", "127.0.0.1", "::ffff:127.0.0.1"].includes(ip);
};

const isRecentlySeen = (ip) => {
  const lastSeen = ipVisitCache.get(ip);
  if (!lastSeen) return false;
  const minutesSinceLastSeen = (Date.now() - lastSeen) / (1000 * 60);
  return minutesSinceLastSeen < DEBOUNCE_MINUTES;
};

const sendEmail = async (details) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.OUTGOING_SERVER_HOST,
      port: process.env.OUTGOING_SERVER_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: `Admin <${process.env.EMAIL_USER}>`,
      to: process.env.USER_TRACKER_RECIPIENT_EMAIL,
      subject: "🚨 New Portfolio Visit " + details.time,
      html: userTrackerEmail(details),
    });
    console.log(`[UserTracker] Email sent for IP: ${details.ip}`);
  } catch (error) {
    console.error("[UserTracker] Email sending failed:", error.message);
  }
};

module.exports = () => async (req, res, next) => {
  const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0].trim();

  if (isLocalHost(ip) || isRecentlySeen(ip)) {
    return next();
  }

  const userAgent = req.headers["user-agent"] || "Unknown";
  const referrer = req.get("Referrer") || "Direct";

  let geo = { city: "Unknown", region: "Unknown", country_name: "Unknown" };
  try {
    const { data } = await axios.get(`https://ipapi.co/${ip}/json`);
    geo = data;
  } catch (error) {
    console.error("[UserTracker] Geo lookup failed:", error.message);
  }

  const details = {
    ip,
    userAgent,
    referrer,
    city: geo.city,
    region: geo.region,
    country: geo.country_name,
    time: moment().format("MMMM DD YYYY, hh:mm:ss a"),
  };
  console.log("[UserTracker] User details:", details);
  await sendEmail(details);
  ipVisitCache.set(ip, Date.now());

  next();
};
