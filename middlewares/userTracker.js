const axios = require("axios");

const ipVisitCache = new Map();

const DEBOUNCE_MINUTES = 0.1;

const isLocalHost = (ip) => {
  return ["::1", "127.0.0.1", "::ffff:127.0.0.1"].includes(ip);
};

const isRecentlySeen = (ip) => {
  const lastSeen = ipVisitCache.get(ip);
  if (!lastSeen) return false;
  const minutesSinceLastSeen = (Date.now() - lastSeen) / (1000 * 60);
  return minutesSinceLastSeen < DEBOUNCE_MINUTES;
};

const sendEmail = async (details) => {};

module.exports = () => async (req, res, next) => {
  const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0].trim();

  if (
    // isLocalhost(ip) ||
    isRecentlySeen(ip)
  ) {
    return next();
  }

  const userAgent = req.headers["user-agent"] || "Unknown";
  const referrer = req.get("Referrer") || "Direct";

  let geo = { city: "Unknown", region: "Unknown", country_name: "Unknown" };
  try {
    console.log("ip", ip);
    const { data } = await axios.get(`https://ipapi.co/${ip}/json`);
    // geo = await response.json();
    // console.log("data", data);
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
    time: new Date().toLocaleString(),
  };
  console.log("[UserTracker] User details:", details);
  //   await sendEmail(details);
  ipVisitCache.set(ip, Date.now());

  next();
};
