# Vercel Deployment Guide - Environment Variables Setup

## Setting Environment Variables in Vercel

### Method 1: Vercel Dashboard (Recommended)

1. **Login to Vercel**
   - Go to https://vercel.com/dashboard
   - Select your project: `tmobile-optimizer`

2. **Navigate to Settings**
   - Click on your project
   - Go to "Settings" tab
   - Select "Environment Variables" from the left sidebar

3. **Add Environment Variables**

   Click "Add New" and add each variable:

   | Variable Name | Value | Environment | Encrypted |
   |--------------|-------|-------------|-----------|
   | `VITE_ADMIN_PASSWORD` | Your secure password | Production | ✓ |
   | `VITE_ANTHROPIC_API_KEY` | sk-ant-api03-... | Production | ✓ |
   | `VITE_ENABLE_PDF_READER` | true | Production | ✗ |
   | `VITE_ENABLE_VISION_API` | true | Production | ✗ |

4. **Save and Redeploy**
   - Click "Save" for each variable
   - Go to "Deployments" tab
   - Click "Redeploy" on the latest deployment
   - Select "Redeploy with existing Build Cache"

### Method 2: Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Set environment variables via CLI
vercel env add VITE_ADMIN_PASSWORD production
vercel env add VITE_ANTHROPIC_API_KEY production
vercel env add VITE_ENABLE_PDF_READER production
vercel env add VITE_ENABLE_VISION_API production

# Deploy with new environment variables
vercel --prod
```

### Method 3: vercel.json Configuration

Create or update `vercel.json` in your project root:

```json
{
  "env": {
    "VITE_ENABLE_PDF_READER": "true",
    "VITE_ENABLE_VISION_API": "true"
  },
  "build": {
    "env": {
      "VITE_ENABLE_PDF_READER": "true",
      "VITE_ENABLE_VISION_API": "true"
    }
  }
}
```

**Note**: Never put sensitive values (passwords, API keys) in vercel.json as it's committed to Git!

## Getting API Keys

### Anthropic Claude API Key

1. **Sign up for Claude API**
   - Go to https://console.anthropic.com/
   - Create an account or sign in
   - Navigate to "API Keys" section

2. **Create New API Key**
   - Click "Create Key"
   - Name it (e.g., "T-Mobile Sales Edge Production")
   - Copy the key (starts with `sk-ant-api03-`)
   - Save it securely - you won't see it again!

3. **Set Usage Limits (Recommended)**
   - Go to "Usage" section
   - Set monthly spending limit
   - Enable notifications for usage thresholds

### OpenAI API Key (Optional Fallback)

1. **Sign up for OpenAI**
   - Go to https://platform.openai.com/
   - Create account or sign in
   - Navigate to "API keys"

2. **Create New Secret Key**
   - Click "Create new secret key"
   - Name it appropriately
   - Copy and save securely

## Security Best Practices

### 1. **Separate Keys for Environments**
```
Development: sk-ant-api03-dev-xxxxx
Staging: sk-ant-api03-staging-xxxxx  
Production: sk-ant-api03-prod-xxxxx
```

### 2. **Rotate Keys Regularly**
- Set calendar reminder for quarterly rotation
- Update in Vercel Dashboard
- Delete old keys from provider

### 3. **Monitor Usage**
- Check Anthropic Console weekly
- Set up usage alerts
- Review logs for unusual activity

### 4. **Restrict API Key Permissions**
- Use read-only keys where possible
- Limit to specific models/endpoints
- Set rate limits

## Testing Environment Variables

### Local Testing
```bash
# Create .env.local file
cp .env.example .env.local

# Edit .env.local with your values
nano .env.local

# Run development server
npm run dev

# Test in browser console
console.log(import.meta.env.VITE_ENABLE_PDF_READER)
```

### Production Testing
After deployment, verify in browser console:
```javascript
// Should return 'true' if properly set
console.log(import.meta.env.VITE_ENABLE_PDF_READER)

// Should return undefined (keys are not exposed to client)
console.log(import.meta.env.VITE_ANTHROPIC_API_KEY)
```

## Troubleshooting

### Variables Not Working?

1. **Check Variable Names**
   - Must start with `VITE_` for Vite to expose them
   - Case sensitive!

2. **Clear Build Cache**
   ```bash
   vercel --prod --force
   ```

3. **Verify in Vercel Dashboard**
   - Settings → Environment Variables
   - Check if variables are set for correct environment

4. **Check Build Logs**
   - Vercel Dashboard → Deployments → View Build Logs
   - Look for environment variable warnings

### Common Issues

| Issue | Solution |
|-------|----------|
| Variable undefined in production | Ensure it starts with `VITE_` |
| API key not working | Check for extra spaces/characters |
| Changes not reflecting | Redeploy after adding variables |
| Variable visible in client code | Never expose sensitive keys to client |

## Cost Management

### Anthropic Claude API Pricing
- Claude 3 Opus: $15/million input tokens, $75/million output tokens
- Claude 3 Sonnet: $3/million input tokens, $15/million output tokens
- Claude 3 Haiku: $0.25/million input tokens, $1.25/million output tokens

### Recommendations
- Use Haiku for PDF text extraction (cheaper)
- Set monthly spending limits
- Cache extracted text to avoid repeated API calls
- Implement rate limiting in your application

## Support

- **Vercel Support**: https://vercel.com/support
- **Anthropic Support**: https://support.anthropic.com/
- **Project Issues**: https://github.com/stuinfla/tmobile-smart-quote-optimizer/issues