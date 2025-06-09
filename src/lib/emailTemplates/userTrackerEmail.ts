export default (placeholders: any) => ` <h2>🚨 New User Visit</h2>
    <p><b>IP:</b> ${placeholders?.ip}</p>
    <p><b>Location:</b> ${placeholders?.city}, ${placeholders?.region}, ${placeholders?.country}</p>
    <p><b>User Agent:</b> ${placeholders?.userAgent}</p>
    <p><b>Referrer:</b> ${placeholders?.referrer}</p>
    <p><b>Request URL:</b> ${placeholders?.requestUrl}</p>
    <p><b>Request Method:</b> ${placeholders?.requestMethod}</p>
    <p><b>Time:</b> ${placeholders.time}</p>
  `;
