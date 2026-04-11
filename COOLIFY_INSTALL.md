# Coolify Installation & Initial Setup

This guide provides the one-line installation for Coolify on your Digital Ocean Ubuntu VPS.

## 1. Install Coolify

Run this command as **root** on your fresh Ubuntu 22.04/24.04 LTS server:

```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

## 2. Initial Setup

1.  **Access Dashboard**: Once installed, visit `http://YOUR_SERVER_IP:8000`.
2.  **Create Admin**: Follow the on-screen instructions to create your administrator account.
3.  **Setup Host**: Your local server (the Droplet) should be automatically added as a "Local" destination.

## 3. Deployment Steps

1.  **Create Project**: Give it a name like `Highway420`.
2.  **Add Resource**: Select **Public Repository** or **GitHub App** (recommended for private repos).
3.  **Configure Build**:
    *   **Build Pack**: Docker
    *   **Dockerfile Path**: `./Dockerfile` (The one we've standardized)
4.  **Add Environment Variables**: Copy the values from `production.env.example` into the "Environment Variables" tab in Coolify.
5.  **Deploy**: Hit "Deploy" and monitor the build.

## 4. Domain Mapping

1.  In Coolify, go to the **Settings** of your application.
2.  Add your domain (e.g., `https://highway420.com`).
3.  Ensure your DNS A Record points to the Droplet IP. Coolify will automatically handle SSL via Let's Encrypt.
