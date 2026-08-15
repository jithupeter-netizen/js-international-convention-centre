import { EmailMessage } from "cloudflare:email";

/**
 * Native Cloudflare Worker for Contact Form Email Delivery
 * 100% Free, Private, Zero 3rd-Party Dependencies
 * Project: J's International Convention Centre
 * Domain: jsconventioncentre.in
 */

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const data = await request.json();
      const { name, email, phone, date, guests, eventType, message } = data;

      const recipientEmails = ["jithupeter@gmail.com", "js.international.kollam@gmail.com"];

      for (const recipient of recipientEmails) {
        const rawEmail = 
          `From: "J's Convention Inquiry" <inquiry@jsconventioncentre.in>\r\n` +
          `To: ${recipient}\r\n` +
          `Reply-To: ${email || 'no-reply@jsconventioncentre.in'}\r\n` +
          `Subject: New Event Inquiry from ${name || 'Website Visitor'}\r\n` +
          `Content-Type: text/html; charset=UTF-8\r\n\r\n` +
          `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 24px; border-radius: 12px;">` +
          `<h2 style="color: #1a1a1a; margin-top: 0;">New Event Inquiry</h2>` +
          `<p style="color: #666;">J's International Convention Centre</p>` +
          `<hr style="border: none; border-top: 1px solid #eeeeee; margin: 16px 0;" />` +
          `<p><strong>Name:</strong> ${name || 'Not provided'}</p>` +
          `<p><strong>Email:</strong> <a href="mailto:${email}">${email || 'Not provided'}</a></p>` +
          `<p><strong>Phone:</strong> <a href="tel:${phone}">${phone || 'Not provided'}</a></p>` +
          `<p><strong>Event Date:</strong> ${date || 'Not specified'}</p>` +
          `<p><strong>Estimated Guests:</strong> ${guests || 'Not specified'}</p>` +
          `<p><strong>Event Type:</strong> ${eventType || 'Not specified'}</p>` +
          `<p><strong>Message:</strong></p>` +
          `<div style="background-color: #f8f6f3; border-left: 4px solid #cbad8d; padding: 12px 16px; border-radius: 4px; color: #333;">${message || 'No additional notes.'}</div>` +
          `</div>`;

        const msg = new EmailMessage(
          "inquiry@jsconventioncentre.in",
          recipient,
          rawEmail
        );

        if (env.SEB) {
          await env.SEB.send(msg);
        }
      }

      return new Response(JSON.stringify({ success: true, message: "Inquiry sent successfully" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (err) {
      return new Response(JSON.stringify({ success: false, error: err.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  },
};
