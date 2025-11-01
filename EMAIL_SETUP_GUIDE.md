# Email Setup Guide for Feedback System

This guide explains how to set up email notifications for the user feedback system.

## Overview

The feedback system sends email notifications to `bensondc73@gmail.com` whenever users submit feedback through the website. This uses Gmail's SMTP service with app-specific passwords for security.

## Gmail Setup Instructions

### 1. Enable 2-Factor Authentication (2FA)

If you haven't already, enable 2FA on your Gmail account:
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Navigate to **Security** → **Signing in to Google**
3. Click **2-Step Verification** and follow the setup process

### 2. Generate App-Specific Password

1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Sign in with your Gmail account (`bensondc73@gmail.com`)
3. Select **Mail** as the app
4. Select **Other (custom name)** as the device
5. Enter a custom name like "Highway420 Feedback System"
6. Click **Generate**

### 3. Copy the App Password

- Gmail will generate a 16-character password (e.g., `abcd-efgh-ijkl-mnop`)
- **Important**: Copy this password immediately - you won't be able to see it again
- Remove the spaces when copying (should be 16 characters total)

### 4. Configure Environment Variables

Update your `.env.local` file with the app password:

```bash
# Replace 'your_app_specific_password_here' with the actual password
EMAIL_APP_PASSWORD=abcd-efgh-ijkl-mnop
```

The `EMAIL_USER` is already set to `bensondc73@gmail.com`.

## Testing the Setup

### 1. Start the Development Server

```bash
pnpm dev
```

### 2. Test the Feedback System

1. Open your browser to `http://localhost:3000`
2. Click the green "Feedback" button in the bottom-right corner
3. Fill out and submit a test feedback form
4. Check your email (`bensondc73@gmail.com`) for the notification

### 3. Verify Email Receipt

The email should contain:
- Subject: `HIGHWAY 420 - [Feedback Type] #[Issue Number]`
- Professional HTML formatting with Highway 420 branding
- Complete feedback details including user description, page URL, and browser info

## Troubleshooting

### Common Issues

**"Authentication failed" error:**
- Double-check the app password (no spaces, exactly 16 characters)
- Ensure 2FA is enabled on your Gmail account
- Try generating a new app password

**Emails not being received:**
- Check your spam/junk folder
- Verify the `EMAIL_USER` is set to `bensondc73@gmail.com`
- Check server logs for any error messages

**Gmail blocks the sign-in:**
- If Gmail shows a security alert, click "Allow access" for less secure apps
- You may need to temporarily disable "Less secure app access" warnings

### Gmail Security Settings

If you encounter issues, you may need to adjust Gmail security settings:

1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Under "Less secure app access", ensure it's enabled
3. You might need to allow access for the app password

## Production Deployment

When deploying to production, ensure these environment variables are set in your hosting platform:

```bash
EMAIL_USER=bensondc73@gmail.com
EMAIL_APP_PASSWORD=your_production_app_password
```

**Security Note:** Never commit actual passwords to version control. The `.env.local` file is already in `.gitignore`.

## Support

If you continue to have issues:
1. Check the server console logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test with a simple email client first to confirm SMTP connectivity

The feedback system will continue to work even if email sending fails - it will log errors but still save feedback to the document.
