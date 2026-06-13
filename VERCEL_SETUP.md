# Vercel Production Deployment

## Environment Variables to Set

Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

**Required Variables:**

```bash
# NextAuth Configuration
NEXTAUTH_URL=https://spiffydocs.ai
NEXTAUTH_SECRET=<REDACTED>

# Google OAuth
GOOGLE_CLIENT_ID=<REDACTED>
GOOGLE_CLIENT_SECRET=<REDACTED>

# GitHub OAuth (if using)
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# Live Call Intelligence Backend
NEXT_PUBLIC_BACKEND_URL=https://your-app.railway.app

# Authentication Whitelist - CRITICAL
ALLOWED_EMAILS=markrdalton8@gmail.com,mark@spiffydocs.ai,admin@spiffydocs.ai
```

## Who Can Sign In

Only these email addresses are allowed:
- ✅ markrdalton8@gmail.com
- ✅ mark@spiffydocs.ai
- ✅ admin@spiffydocs.ai

**Everyone else will be denied access.**

## Google OAuth Setup

Make sure your Google OAuth app has these authorized redirect URIs:
- http://localhost:3000/api/auth/callback/google (development)
- https://spiffydocs.ai/api/auth/callback/google (production)

Configure at: https://console.cloud.google.com/apis/credentials

## Testing Access Control

1. **Should work:** Sign in with markrdalton8@gmail.com
2. **Should fail:** Sign in with any other email (e.g., test@gmail.com)

Failed sign-ins are logged to Vercel logs.

## Adding More Users

To add more allowed emails:
1. Update the `ALLOWED_EMAILS` variable in Vercel
2. Use comma-separated list: `email1@domain.com,email2@domain.com`
3. Redeploy or wait for next deployment

No code changes needed!
