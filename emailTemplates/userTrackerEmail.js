const moment = require("moment/moment");

module.exports = (placeholders) => `
    <h2>🚨 New User Visit</h2>
    <p><b>IP:</b> ${placeholders?.ip}</p>
    <p><b>Location:</b> ${placeholders?.city}, ${placeholders?.region}, ${placeholders?.country}</p>
    <p><b>User Agent:</b> ${placeholders?.userAgent}</p>
    <p><b>Referrer:</b> ${placeholders?.referrer}</p>
    <p><b>Time:</b> ${placeholders.time}</p>
  `;
