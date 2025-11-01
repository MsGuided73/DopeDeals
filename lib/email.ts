import nodemailer from 'nodemailer';

interface FeedbackData {
  type: 'bug' | 'design' | 'feature' | 'other';
  description: string;
  pageUrl: string;
  browser: string;
  contactInfo?: string;
  timestamp: string;
  issueNumber: number;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD, // App-specific password for Gmail
  },
});

export async function sendFeedbackEmail(feedback: FeedbackData): Promise<void> {
  const typeLabels = {
    bug: '🐛 Bug Report',
    design: '🎨 Design Issue',
    feature: '✨ Feature Request',
    other: '💭 Other Feedback'
  };

  const severityMap = {
    bug: 'Medium',
    design: 'Low',
    feature: 'Low',
    other: 'Low'
  };

  const subject = `HIGHWAY 420 - ${typeLabels[feedback.type]} #${feedback.issueNumber}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #2d8f47; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; background: #f9f9f9; border-radius: 0 0 8px 8px; }
        .section { margin-bottom: 20px; }
        .label { font-weight: bold; color: #2d8f47; }
        .code { background: #f0f0f0; padding: 10px; border-radius: 4px; font-family: monospace; }
        .urgent { color: #d32f2f; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>HIGHWAY 420 - User Feedback</h1>
        <h2>${typeLabels[feedback.type]} #${feedback.issueNumber}</h2>
      </div>

      <div class="content">
        <div class="section">
          <span class="label">Type:</span> ${typeLabels[feedback.type]}<br>
          <span class="label">Severity:</span> ${severityMap[feedback.type]}<br>
          <span class="label">Date:</span> ${new Date(feedback.timestamp).toLocaleString()}<br>
          <span class="label">Page:</span> ${feedback.pageUrl}<br>
          <span class="label">Browser:</span> ${feedback.browser}
        </div>

        <div class="section">
          <span class="label">Description:</span><br>
          <div class="code">${feedback.description.replace(/\n/g, '<br>')}</div>
        </div>

        ${feedback.contactInfo ? `
        <div class="section">
          <span class="label">Contact Info:</span> ${feedback.contactInfo}
        </div>
        ` : ''}

        <div class="section">
          <span class="label">Next Steps:</span><br>
          • Review the issue in POST_DEPLOYMENT_GLITCHES.md<br>
          • Assign to appropriate team member<br>
          • Update status and add resolution notes
        </div>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

        <div style="font-size: 12px; color: #666;">
          This feedback was automatically submitted via the Highway 420 website feedback system.
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'bensondc73@gmail.com',
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Feedback email sent for issue #${feedback.issueNumber}`);
  } catch (error) {
    console.error('Failed to send feedback email:', error);
    throw error;
  }
}
