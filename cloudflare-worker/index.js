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

      const recipientEmails = ["jithupeter@gmail.com", "js.international.kollam@gmail.com"];

      for (const recipient of recipientEmails) {
        const textBody = 
          `New Event Inquiry - J's International Convention Centre\n\n` +
          `Name: ${name || 'Not provided'}\n` +
          `Email: ${email || 'Not provided'}\n` +
          `Phone: ${phone || 'Not provided'}\n` +
          `Event Date: ${date || 'Not specified'}\n` +
          `Guests: ${guests || 'Not specified'}\n` +
          `Event Type: ${eventType || 'Not specified'}\n\n` +
          `Message:\n${message || 'No additional notes'}`;

        const emailPayload = {
          from: "inquiry@jsconventioncentre.in",
          to: recipient,
          subject: `New Event Inquiry from ${name || 'Website Visitor'}`,
          text: textBody,
        };

        if (env.SEND_EMAIL) {
          await env.SEND_EMAIL.send(emailPayload);
        } else if (env.SEB) {
          await env.SEB.send(emailPayload);
        }
      }

      return new Response(JSON.stringify({ success: true, message: "Inquiry processed" }), {
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
