import userTrackerEmail from "@/lib/emailTemplates/userTrackerEmail";
import axios from "axios";
import moment from "moment-timezone";
import { NextResponse } from "next/server";

const nodemailer = require("nodemailer");

export const POST = async (req: Request) => {
  const body = await req.json();
  const { ip, userAgent, referrer, pathname, method, timestamp } = body;

  let geo = { city: "Unknown", region: "Unknown", country_name: "Unknown" };
  try {
    const { data } = await axios.get(`https://ipapi.co/${ip}/json`);
    geo = data;
  } catch (err: any) {
    console.error("[UserTracker] Geo lookup failed:", err.message);
  }

  const details = {
    ip,
    userAgent,
    referrer,
    city: geo.city,
    region: geo.region,
    country: geo.country_name,
    requestUrl: pathname,
    requestMethod: method,
    time: moment(timestamp).tz("America/Vancouver").format("MMMM DD YYYY, hh:mm:ss a"),
  };

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.OUTGOING_SERVER_HOST,
      port: Number(process.env.OUTGOING_SERVER_PORT),
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

    console.log("[UserTracker] Email sent for IP:", ip);
  } catch (error: any) {
    console.error("[UserTracker] Email failed:", error.message);
  }

  return NextResponse.json({ status: "tracked" });
};
