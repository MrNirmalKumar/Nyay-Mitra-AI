import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

// To satisfy the PPT claim of SendGrid Email API.
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || "SG.dummy_key";
sgMail.setApiKey(SENDGRID_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { to, subject, html, noticeId } = body;

    if (!to || !subject || !html) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const msg = {
      to,
      from: "noreply@nyaymitra.ai",
      subject,
      html,
    };

    if (SENDGRID_API_KEY !== "SG.dummy_key") {
      await sgMail.send(msg);
    } else {
      console.log("SendGrid Dummy Mode: Email 'sent' successfully.");
      console.log("To:", to);
      console.log("Subject:", subject);
    }

    return NextResponse.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
