// api/send-email.js
// Vercel Serverless Function — runs securely on the server, never exposed to the browser

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'uwumiromoses@gmail.com';

// ✅ Once your domain is verified in Resend, update this to:
// 'Lyceum Laundromat <noreply@yourdomain.com>'
// Until then, we use Resend's test domain (only works for verified recipient emails during testing)
const FROM_DOMAIN = process.env.FROM_EMAIL_DOMAIN || 'noreply@lyceumlaundromat.com.ng';
const FROM_EMAIL = `Lyceum Laundromat <${FROM_DOMAIN}>`;

export default async function handler(req, res) {
  // ── CORS Headers (allows browser fetch() to call this function) ──
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, payload } = req.body;

  if (!type || !payload) {
    return res.status(400).json({ error: 'Missing type or payload' });
  }

  try {
    let emailData = null;

    // ── EMAIL TEMPLATES ──────────────────────────────────────────────────────
    switch (type) {

      // 1. New Order — sent to admin + customer receipt
      case 'new_order': {
        const { customerName, customerEmail, orderId, items, total, address } = payload;

        const safeItems = Array.isArray(items) ? items : [];
        const itemRows = safeItems.map(item =>
          `<tr>
            <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;">${item.name || 'Item'}</td>
            <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;">${item.service || '-'}</td>
            <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:center;">${item.qty || 1}</td>
            <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:bold;color:#E85D04;">₦${((item.price || 0) * (item.qty || 1)).toLocaleString()}</td>
          </tr>`
        ).join('');

        const adminEmailHtml = `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:#0F3024;padding:24px;border-radius:12px 12px 0 0;">
              <h1 style="color:white;margin:0;font-size:24px;">🧺 New Order Received!</h1>
              <p style="color:#E85D04;margin:4px 0 0;font-size:14px;">Order #${orderId}</p>
            </div>
            <div style="background:#f9f9f9;padding:24px;border:1px solid #eee;border-radius:0 0 12px 12px;">
              <p><strong>Customer:</strong> ${customerName}</p>
              ${customerEmail ? `<p><strong>Email:</strong> ${customerEmail}</p>` : ''}
              <p><strong>Pickup Address:</strong> ${address || 'Not specified'}</p>
              <table style="width:100%;border-collapse:collapse;margin-top:16px;background:white;border-radius:8px;overflow:hidden;">
                <thead>
                  <tr style="background:#0F3024;color:white;">
                    <th style="padding:10px 12px;text-align:left;">Item</th>
                    <th style="padding:10px 12px;text-align:left;">Service</th>
                    <th style="padding:10px 12px;text-align:center;">Qty</th>
                    <th style="padding:10px 12px;text-align:right;">Price</th>
                  </tr>
                </thead>
                <tbody>${itemRows}</tbody>
              </table>
              <div style="margin-top:16px;text-align:right;font-size:20px;font-weight:bold;color:#0F3024;">
                Total: <span style="color:#E85D04;">₦${(total || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        `;

        // Admin notification (always send this)
        await resend.emails.send({
          from: FROM_EMAIL,
          to: ADMIN_EMAIL,
          subject: `🧺 New Order #${orderId} from ${customerName}`,
          html: adminEmailHtml,
        });

        // Customer receipt (only if we have their email)
        if (customerEmail) {
          emailData = await resend.emails.send({
            from: FROM_EMAIL,
            to: customerEmail,
            subject: `✅ Your Lyceum Order is Confirmed! (#${orderId})`,
            html: `
              <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
                <div style="background:#0F3024;padding:24px;border-radius:12px 12px 0 0;text-align:center;">
                  <h1 style="color:white;margin:0;font-size:28px;">Order Confirmed! 🧺</h1>
                  <p style="color:#E85D04;margin:8px 0 0;">Order #${orderId}</p>
                </div>
                <div style="background:#f9f9f9;padding:24px;border:1px solid #eee;border-radius:0 0 12px 12px;">
                  <p style="font-size:16px;">Hi <strong>${customerName}</strong>,</p>
                  <p>Thank you for choosing Lyceum Laundromat! Your order has been received and we'll be in touch shortly to confirm your pickup.</p>
                  <table style="width:100%;border-collapse:collapse;margin-top:16px;background:white;border-radius:8px;overflow:hidden;">
                    <thead>
                      <tr style="background:#0F3024;color:white;">
                        <th style="padding:10px 12px;text-align:left;">Item</th>
                        <th style="padding:10px 12px;text-align:left;">Service</th>
                        <th style="padding:10px 12px;text-align:center;">Qty</th>
                        <th style="padding:10px 12px;text-align:right;">Price</th>
                      </tr>
                    </thead>
                    <tbody>${itemRows}</tbody>
                  </table>
                  <div style="margin-top:16px;text-align:right;font-size:20px;font-weight:bold;">
                    Total: <span style="color:#E85D04;">₦${(total || 0).toLocaleString()}</span>
                  </div>
                  <div style="margin-top:24px;padding:16px;background:#E85D04;border-radius:8px;text-align:center;">
                    <p style="color:white;margin:0;font-weight:bold;">📍 Pickup Address: ${address || 'Confirmed at booking'}</p>
                  </div>
                  <p style="color:#666;font-size:13px;margin-top:24px;">Questions? Reply to this email or WhatsApp us at +234 708 500 4780</p>
                </div>
              </div>
            `
          });
        } else {
          emailData = { message: 'Admin notified; no customer email provided.' };
        }
        break;
      }

      // 2. Support Ticket — sent to admin
      case 'support_ticket': {
        const { senderEmail, message } = payload;
        emailData = await resend.emails.send({
          from: FROM_EMAIL,
          to: ADMIN_EMAIL,
          replyTo: senderEmail,
          subject: `💬 New Support Message from ${senderEmail}`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
              <div style="background:#0F3024;padding:20px;border-radius:12px 12px 0 0;">
                <h2 style="color:white;margin:0;">New Support Ticket</h2>
              </div>
              <div style="background:#f9f9f9;padding:24px;border:1px solid #eee;border-radius:0 0 12px 12px;">
                <p><strong>From:</strong> ${senderEmail}</p>
                <div style="background:white;padding:16px;border-radius:8px;border-left:4px solid #E85D04;margin-top:12px;">
                  <p style="margin:0;">${message}</p>
                </div>
                <p style="color:#666;font-size:12px;margin-top:16px;">Reply directly to this email to respond to the customer.</p>
              </div>
            </div>
          `
        });
        break;
      }

      // 3. Newsletter subscriber — sent to admin
      case 'newsletter': {
        const { subscriberEmail } = payload;
        emailData = await resend.emails.send({
          from: FROM_EMAIL,
          to: ADMIN_EMAIL,
          subject: `📧 New Newsletter Subscriber: ${subscriberEmail}`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f9f9f9;border-radius:12px;">
              <h2 style="color:#0F3024;">New Newsletter Subscriber!</h2>
              <p style="font-size:18px;font-weight:bold;color:#E85D04;">${subscriberEmail}</p>
              <p style="color:#666;">has subscribed to the Lyceum Laundromat newsletter.</p>
            </div>
          `
        });
        break;
      }

      // 4. Customer review/feedback — sent to admin
      case 'customer_review': {
        const { reviewerName, reviewerEmail, rating, comment } = payload;
        const stars = '⭐'.repeat(rating);
        emailData = await resend.emails.send({
          from: FROM_EMAIL,
          to: ADMIN_EMAIL,
          subject: `${stars} New ${rating}-Star Review from ${reviewerName}`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
              <div style="background:#0F3024;padding:20px;border-radius:12px 12px 0 0;">
                <h2 style="color:white;margin:0;">New Customer Review</h2>
              </div>
              <div style="background:#f9f9f9;padding:24px;border:1px solid #eee;border-radius:0 0 12px 12px;">
                <p><strong>${reviewerName}</strong> (${reviewerEmail})</p>
                <p style="font-size:28px;margin:8px 0;">${stars}</p>
                <div style="background:white;padding:16px;border-radius:8px;border-left:4px solid #E85D04;">
                  <p style="margin:0;font-style:italic;">"${comment}"</p>
                </div>
              </div>
            </div>
          `
        });
        break;
      }

      // 5. Order Status Update — sent to customer
      case 'status_update': {
        const { customerName, customerEmail, orderId, status } = payload;

        const statusMessages = {
          'Pickup':          { emoji: '🚗', msg: 'Our rider is on the way to pick up your laundry!' },
          'Washing/Ironing': { emoji: '🧺', msg: 'Your clothes are being expertly cleaned and pressed.' },
          'Delivery':        { emoji: '🚚', msg: 'Your fresh laundry is out for delivery right now!' },
          'Completed':       { emoji: '✅', msg: 'All done! Your laundry has been delivered. Enjoy!' },
          'Order Placed':    { emoji: '📦', msg: 'Your order has been received and is being processed.' },
        };

        const { emoji, msg } = statusMessages[status] || { emoji: '🔔', msg: `Your order status has been updated to "${status}".` };

        emailData = await resend.emails.send({
          from: FROM_EMAIL,
          to: customerEmail,
          subject: `${emoji} Order #${orderId} Update: ${status}`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
              <div style="background:#0F3024;padding:24px;border-radius:12px 12px 0 0;text-align:center;">
                <h1 style="color:white;margin:0;font-size:26px;">Order Update ${emoji}</h1>
                <p style="color:#E85D04;margin:6px 0 0;font-size:14px;">Order #${orderId}</p>
              </div>
              <div style="background:#f9f9f9;padding:28px;border:1px solid #eee;border-radius:0 0 12px 12px;">
                <p style="font-size:16px;">Hi <strong>${customerName}</strong>,</p>
                <div style="background:#E85D04;color:white;padding:20px;border-radius:12px;text-align:center;margin:20px 0;">
                  <p style="font-size:22px;margin:0;font-weight:bold;">${status}</p>
                </div>
                <p style="color:#444;font-size:15px;">${msg}</p>
                <p style="color:#666;font-size:13px;margin-top:24px;">
                  Track your order in real time at <a href="${process.env.VITE_APP_URL || 'https://lyceum.vercel.app'}/track/${orderId}" style="color:#E85D04;">Lyceum Tracking</a>
                </p>
                <p style="color:#999;font-size:12px;margin-top:16px;">Questions? WhatsApp us at +234 708 500 4780</p>
              </div>
            </div>
          `
        });
        break;
      }

      default:
        return res.status(400).json({ error: `Unknown email type: ${type}` });
    }

    return res.status(200).json({ success: true, data: emailData });

  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
}
