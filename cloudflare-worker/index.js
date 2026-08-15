/**
 * Cloudflare Worker for Contact Form Email Delivery
 * Project: J's International Convention Centre
 * Domain: jsconventioncentre.in
 */

export default {
  async fetch(request, env) {
    // Handle CORS preflight for client-side form submissions
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

      // Resend.com API Key stored in Worker Environment Variables (RESEND_API_KEY)
      const resendApiKey = env.RESEND_API_KEY;

      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 24px; borderRadius: 12px;">
          <h2 style="color: #1a1a1a; margin-top: 0;">New Event Inquiry</h2>
          <p style="color: #666;">J's International Convention Centre</p>
          <hr style="border: none; border-top: 1px solid #eeeeee; margin: 16px 0;" />
          <p><strong>Name:</strong> ${name || 'Not provided'}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email || 'Not provided'}</a></p>
          <p><strong>Phone:</strong> <a href="tel:${phone}">${phone || 'Not provided'}</a></p>
          <p><strong>Event Date:</strong> ${date || 'Not specified'}</p>
          <p><strong>Estimated Guests:</strong> ${guests || 'Not specified'}</p>
          <p><strong>Event Type:</strong> ${eventType || 'Not specified'}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f8f6f3; border-left: 4px solid #cbad8d; padding: 12px 16px; border-radius: 4px; color: #333;">
            ${message || 'No additional details provided.'}
          </div>
        </div>
      `;

      // Call Resend API for 100% reliable inbox delivery
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "J's Convention Inquiry <onboarding@resend.dev>",
          to: ["jithupeter@gmail.com", "js.international.kollam@gmail.com"],
          subject: `New Event Inquiry from ${name} - J's International`,
          html: htmlBody,
          reply_to: email,
        }),
      });

      if (res.ok) {
        return new Response(JSON.stringify({ success: true, message: "Inquiry sent successfully" }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      } else {
        const errorText = await res.text();
        return new Response(JSON.stringify({ success: false, error: errorText }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }
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
