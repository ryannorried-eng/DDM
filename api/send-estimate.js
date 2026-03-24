import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL        = process.env.FROM_EMAIL;
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL;
const COMPANY_NAME      = process.env.COMPANY_NAME      || 'Your Building Company';
const COMPANY_PHONE     = process.env.COMPANY_PHONE     || '';
const COMPANY_WEBSITE   = process.env.COMPANY_WEBSITE   || '';

// ── Helpers ────────────────────────────────────────────────────────────────

function fmt(n) {
  return typeof n === 'number'
    ? '$' + n.toLocaleString('en-US')
    : String(n ?? '—');
}

function label(val) {
  if (val === null || val === undefined || val === '') return '—';
  return String(val).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── HTML builders ──────────────────────────────────────────────────────────

function internalEmailHtml({ lead, config, estimate }) {
  const sqft = (Number(config.width) || 0) * (Number(config.length) || 0);

  const rows = (pairs) =>
    pairs
      .map(
        ([k, v]) => `
      <tr>
        <td style="padding:6px 12px;color:#64748b;font-size:13px;white-space:nowrap;">${k}</td>
        <td style="padding:6px 12px;color:#1e293b;font-size:13px;font-weight:500;">${v}</td>
      </tr>`
      )
      .join('');

  const section = (title, pairs) => `
    <div style="margin-bottom:24px;">
      <p style="margin:0 0 8px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8;">${title}</p>
      <table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:8px;overflow:hidden;">
        <tbody>
          ${rows(pairs)}
        </tbody>
      </table>
    </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>New Building Quote Request</title></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">

        <!-- Header -->
        <tr>
          <td style="background:#1e3a5f;padding:24px 32px;">
            <p style="margin:0;font-size:11px;color:#94a3b8;letter-spacing:.1em;text-transform:uppercase;">Internal Notification</p>
            <h1 style="margin:4px 0 0;font-size:22px;color:#ffffff;font-weight:700;">New Building Quote Request</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">

            ${section('Lead Information', [
              ['Name',  lead.name],
              ['Email', lead.email],
              ['Phone', lead.phone || '—'],
            ])}

            ${section('Building Configuration', [
              ['Building Use',   label(config.buildingUse)],
              ['Dimensions',     `${config.width || '—'} × ${config.length || '—'} × ${config.height || '—'} ft`],
              ['Square Footage', sqft ? sqft.toLocaleString('en-US') + ' sq ft' : '—'],
              ['Roof Style',     label(config.roofStyle)],
              ['Walk Doors',     String(config.walkDoors ?? 0)],
              ['Roll-Up Doors',  String(config.rollUpDoors ?? 0)],
              ['Windows',        String(config.windows ?? 0)],
              ['Insulation',     label(config.insulation)],
              ['Finish / Color', label(config.finish)],
            ])}

            ${section('Estimate', [
              ['Range',  estimate.formattedRange || `${fmt(estimate.rangeLow)} – ${fmt(estimate.rangeHigh)}`],
              ['Low',    fmt(estimate.rangeLow)],
              ['High',   fmt(estimate.rangeHigh)],
              ['Total (mid)', fmt(estimate.total)],
            ])}

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 32px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#94a3b8;">${COMPANY_NAME}</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function customerEmailHtml({ lead, config, estimate }) {
  const sqft = (Number(config.width) || 0) * (Number(config.length) || 0);

  const breakdownRows = [
    config.buildingUse   ? ['Building Use',   label(config.buildingUse)]   : null,
    config.width && config.length
      ? ['Dimensions', `${config.width} × ${config.length}${config.height ? ' × ' + config.height : ''} ft`]
      : null,
    sqft ? ['Square Footage', sqft.toLocaleString('en-US') + ' sq ft'] : null,
    config.roofStyle     ? ['Roof Style',     label(config.roofStyle)]     : null,
    config.walkDoors     ? ['Walk Doors',     String(config.walkDoors)]    : null,
    config.rollUpDoors   ? ['Roll-Up Doors',  String(config.rollUpDoors)]  : null,
    config.windows       ? ['Windows',        String(config.windows)]      : null,
    config.insulation    ? ['Insulation',     label(config.insulation)]    : null,
    config.finish        ? ['Finish / Color', label(config.finish)]        : null,
  ].filter(Boolean);

  const configRows = breakdownRows
    .map(
      ([k, v]) => `
      <tr>
        <td style="padding:6px 12px;color:#64748b;font-size:13px;">${k}</td>
        <td style="padding:6px 12px;color:#1e293b;font-size:13px;font-weight:500;">${v}</td>
      </tr>`
    )
    .join('');

  const priceRows = [
    ['Estimated Range', `<strong>${estimate.formattedRange || `${fmt(estimate.rangeLow)} – ${fmt(estimate.rangeHigh)}`}</strong>`],
    ['Low Estimate',  fmt(estimate.rangeLow)],
    ['High Estimate', fmt(estimate.rangeHigh)],
  ]
    .map(
      ([k, v]) => `
      <tr>
        <td style="padding:6px 12px;color:#64748b;font-size:13px;">${k}</td>
        <td style="padding:6px 12px;color:#1e293b;font-size:13px;">${v}</td>
      </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Your Building Estimate</title></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">

        <!-- Header -->
        <tr>
          <td style="background:#1e3a5f;padding:28px 32px 24px;">
            <p style="margin:0 0 4px;font-size:11px;color:#94a3b8;letter-spacing:.1em;text-transform:uppercase;">${COMPANY_NAME}</p>
            <h1 style="margin:0;font-size:24px;color:#ffffff;font-weight:700;">Your Building Estimate</h1>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="padding:28px 32px 0;">
            <p style="margin:0;font-size:15px;color:#334155;">Hi ${lead.name.split(' ')[0]},</p>
            <p style="margin:12px 0 0;font-size:15px;color:#334155;line-height:1.6;">
              Thank you for using our building configurator. Here's a summary of your custom building estimate based on your selections.
            </p>
          </td>
        </tr>

        <!-- Estimate card -->
        <tr>
          <td style="padding:20px 32px;">
            <div style="background:linear-gradient(135deg,#1e3a5f,#2563eb);border-radius:12px;padding:24px;text-align:center;">
              <p style="margin:0 0 4px;font-size:12px;color:#93c5fd;letter-spacing:.08em;text-transform:uppercase;">Estimated Price Range</p>
              <p style="margin:0;font-size:32px;font-weight:800;color:#ffffff;letter-spacing:-.5px;">
                ${estimate.formattedRange || `${fmt(estimate.rangeLow)} – ${fmt(estimate.rangeHigh)}`}
              </p>
              <p style="margin:8px 0 0;font-size:12px;color:#93c5fd;">Preliminary estimate · subject to final site review</p>
            </div>
          </td>
        </tr>

        <!-- Configuration summary -->
        <tr>
          <td style="padding:0 32px 20px;">
            <p style="margin:0 0 8px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8;">Your Configuration</p>
            <table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:8px;overflow:hidden;">
              <tbody>${configRows}</tbody>
            </table>
          </td>
        </tr>

        <!-- Price breakdown -->
        <tr>
          <td style="padding:0 32px 20px;">
            <p style="margin:0 0 8px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8;">Price Breakdown</p>
            <table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:8px;overflow:hidden;">
              <tbody>${priceRows}</tbody>
            </table>
          </td>
        </tr>

        <!-- Next steps -->
        <tr>
          <td style="padding:0 32px 28px;">
            <p style="margin:0 0 8px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8;">Next Steps</p>
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;">
              <ol style="margin:0;padding-left:20px;color:#166534;font-size:14px;line-height:1.8;">
                <li>A member of our team will reach out within 1–2 business days.</li>
                <li>We'll review your configuration and answer any questions.</li>
                <li>We'll provide a detailed formal quote for your project.</li>
              </ol>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 32px;text-align:center;">
            <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#1e293b;">${COMPANY_NAME}</p>
            ${COMPANY_PHONE ? `<p style="margin:0 0 2px;font-size:12px;color:#64748b;">${COMPANY_PHONE}</p>` : ''}
            ${COMPANY_WEBSITE ? `<p style="margin:0;font-size:12px;color:#64748b;">${COMPANY_WEBSITE}</p>` : ''}
            <p style="margin:12px 0 0;font-size:11px;color:#94a3b8;">This is a preliminary estimate and is subject to change after a full site review.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Handler ────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { lead, config, estimate } = req.body || {};

  // Validate request body
  if (
    !lead || typeof lead !== 'object' ||
    !lead.name  || typeof lead.name  !== 'string' || !lead.name.trim() ||
    !lead.email || typeof lead.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)
  ) {
    return res.status(400).json({ error: 'Invalid lead data: name and email are required.' });
  }

  if (!config || typeof config !== 'object') {
    return res.status(400).json({ error: 'Invalid config data.' });
  }

  if (
    !estimate || typeof estimate !== 'object' ||
    typeof estimate.rangeLow  !== 'number' ||
    typeof estimate.rangeHigh !== 'number' ||
    typeof estimate.total     !== 'number'
  ) {
    return res.status(400).json({ error: 'Invalid estimate data: rangeLow, rangeHigh, and total are required numbers.' });
  }

  const payload = { lead, config, estimate };

  let internalEmailSent = false;
  let customerEmailSent = false;

  try {
    // 1. Internal notification email
    await resend.emails.send({
      from:    FROM_EMAIL,
      to:      NOTIFICATION_EMAIL,
      subject: `New Building Quote Request — ${lead.name.trim()}`,
      html:    internalEmailHtml(payload),
    });
    internalEmailSent = true;

    // 2. Customer confirmation email
    const displayRange =
      estimate.formattedRange ||
      `$${estimate.rangeLow.toLocaleString('en-US')} – $${estimate.rangeHigh.toLocaleString('en-US')}`;

    await resend.emails.send({
      from:    FROM_EMAIL,
      to:      lead.email.trim(),
      subject: `Your Building Estimate — ${displayRange}`,
      html:    customerEmailHtml(payload),
    });
    customerEmailSent = true;

    return res.status(200).json({ success: true, internalEmailSent, customerEmailSent });
  } catch (err) {
    console.error('send-estimate error:', err);
    return res.status(500).json({
      success: false,
      error:   err?.message || 'Failed to send emails.',
    });
  }
}
