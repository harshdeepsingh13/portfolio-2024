const moment = require("moment/moment");

module.exports = (placeholders) => `
    <h2>🚨 New User Visit</h2>
    <p><b>IP:</b> ${placeholder?.ip}</p>
    <p><b>Location:</b> ${placeholder?.city}, ${placeholder?.region}, ${placeholder?.country}</p>
    <p><b>User Agent:</b> ${placeholder?.userAgent}</p>
    <p><b>Referrer:</b> ${placeholder?.referrer}</p>
    <p><b>Time:</b> ${moment.utc(placeholder?.time, "YYYY-MM-DD, hh:mm:ss a").format("MMMM DD YYYY, hh:mm:ss a")}</p>
  `;
