// src/utils/emailClient.js
// Frontend helper — calls our secure Vercel serverless function

/**
 * Send an email via the Vercel serverless /api/send-email endpoint.
 *
 * @param {'new_order'|'support_ticket'|'newsletter'|'customer_review'} type
 * @param {object} payload - Data specific to the email type
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function sendEmail(type, payload) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, payload }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[emailClient] Error:', data.error);
      return { success: false, error: data.error };
    }

    return { success: true };
  } catch (err) {
    console.error('[emailClient] Network error:', err);
    return { success: false, error: err.message };
  }
}
