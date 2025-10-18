# AI Implementation Guide - Google AI Studio (Free Alternative)

## Overview

This guide provides step-by-step instructions for implementing **Google AI Studio (Gemini API)** as a free alternative to Azure OpenAI for the Yorubacinemax project. This solution provides 24/7 uptime, generous free tier limits, and can handle all current AI features without any cost.

---

## Why Google AI Studio?

### Advantages
- ✅ **Completely Free** - No credit card required
- ✅ **24/7 Uptime** - Google infrastructure reliability
- ✅ **Generous Limits** - 15 requests/minute, 1500 requests/day
- ✅ **High Quality** - Gemini 2.0 Flash model
- ✅ **Easy Integration** - Already partially integrated in codebase
- ✅ **Production Ready** - Suitable for live deployment

### Current AI Features Supported
1. Movie recommendations and search
2. Natural language queries
3. Actor information
4. Movie comparisons
5. Cultural context explanations
6. YouTube metadata correction
7. User assistance and chat

---

## Step 1: Get Your Free API Key

### Instructions

1. **Visit Google AI Studio**
   - Go to: https://aistudio.google.com/

2. **Sign In**
   - Use your Google account (Gmail)
   - No credit card required

3. **Create API Key**
   - Click on "Get API Key" in the top right
   - Click "Create API Key"
   - Select "Create API key in new project" (or use existing project)
   - Copy the generated API key (starts with `AIza...`)

4. **Save Your API Key Securely**
   - Store it temporarily in a secure location
   - You'll add it to the `.env` file in the next step

---

## Step 2: Configure Environment Variables

### Add to `.env` File

Open `/home/ubuntu/Yorubacinemax.xyz/.env` and add the following line:

```env
GOOGLE_AI_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with the API key you copied from Google AI Studio.

### Example `.env` File

```env
# Session & Security
SESSION_ENCRYPTION_KEY=iKx6AYNaO44UTW7ZAgDKCELl2zm5xx0Yu4Mcft0iDJ0=
CSRF_SECRET=zhGEc5golW6PlhCgOkupQ9Sxmbsvy0LFrrcbE6QlMbQ=

# Google AI (Free Alternative)
GOOGLE_AI_API_KEY=AIzaSyC_your_actual_api_key_here

# Telegram Bot (Optional)
# TELEGRAM_BOT_TOKEN=your_bot_token
# TELEGRAM_ADMIN_ID=your_admin_id

# Azure OpenAI (Legacy - No longer needed)
# AZURE_OPENAI_ENDPOINT=
# AZURE_OPENAI_API_KEY=
# AZURE_OPENAI_DEPLOYMENT_NAME=

# Azure Storage (Optional)
# AZURE_STORAGE_CONNECTION_STRING=
```

---

## Step 3: Update Server Configuration

The server code already has Google AI integration! The current implementation in `server.ts` automatically falls back to Google AI when Azure OpenAI is not configured.

### Verify Implementation

Check `/home/ubuntu/Yorubacinemax.xyz/server.ts` around line 200-300 for the AI endpoint handler. It should already include Google Generative AI support.

### Current Code Structure

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

// In the /api/azure-ai endpoint:
if (process.env.GOOGLE_AI_API_KEY) {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    // ... use model for chat and recommendations
}
```

---

## Step 4: Install Required Package (If Needed)

The `@google/generative-ai` package should already be installed. If not, run:

```bash
npm install @google/generative-ai
```

---

## Step 5: Test the AI Features

### 5.1 Restart the Development Server

```bash
npm run dev
```

### 5.2 Check Server Logs

You should see:
```
✅ Google AI configured and ready
```

Instead of:
```
❌ Missing Azure OpenAI configuration
```

### 5.3 Test AI Chat

1. Open the website
2. Click the AI chat button (bottom right corner)
3. Try asking questions like:
   - "Recommend a good Yoruba movie"
   - "Tell me about the actor in Jagun Jagun"
   - "What movies are similar to Ifarara?"

### 5.4 Test YouTube Metadata Correction

1. Go to the YouTube Downloader page
2. Paste a YouTube URL
3. The AI should automatically correct and enhance video metadata

---

## Step 6: Rate Limits & Best Practices

### Free Tier Limits

| Metric | Limit |
|--------|-------|
| Requests per minute | 15 |
| Requests per day | 1,500 |
| Requests per month | ~45,000 |

### Best Practices

1. **Implement Caching**
   - Cache common movie recommendations
   - Store frequently asked questions
   - Reduces API calls

2. **Rate Limiting**
   - Already implemented in the codebase
   - Users limited to reasonable request frequency

3. **Error Handling**
   - Graceful degradation if API limit reached
   - User-friendly error messages

4. **Monitor Usage**
   - Check Google AI Studio dashboard regularly
   - Track daily request counts

---

## Step 7: Production Deployment

### Environment Variables for Production

When deploying to production (VPS, cloud hosting, etc.), ensure:

1. **Set Environment Variables**
   ```bash
   export GOOGLE_AI_API_KEY="your_api_key_here"
   ```

2. **Use Environment Variable Management**
   - For VPS: Use `.env` file (not committed to git)
   - For cloud platforms: Use their secrets management
   - For Docker: Use Docker secrets or environment files

3. **Secure Your API Key**
   - Never commit API keys to git
   - Use `.gitignore` to exclude `.env`
   - Rotate keys periodically

---

## Troubleshooting

### Issue: "API key not valid"

**Solution:**
- Verify the API key is correct
- Check for extra spaces or newlines
- Regenerate the key if needed

### Issue: "Quota exceeded"

**Solution:**
- You've hit the daily limit (1,500 requests)
- Wait 24 hours for reset
- Implement caching to reduce requests
- Consider upgrading to paid tier if needed

### Issue: "AI features not working"

**Solution:**
1. Check server logs for errors
2. Verify `GOOGLE_AI_API_KEY` is set in `.env`
3. Restart the server
4. Check browser console for frontend errors

### Issue: "Model not found"

**Solution:**
- Update to latest model name: `gemini-2.5-flash`
- Check Google AI Studio for available models
- Update `services/aiService.ts` if needed

---

## Code Modifications (If Needed)

### Update AI Service Model

If you need to change the model, edit `/home/ubuntu/Yorubacinemax.xyz/services/aiService.ts`:

```typescript
const modelName = 'gemini-2.5-flash'; // or 'gemini-pro', 'gemini-1.5-flash'
```

### Add Custom System Instructions

The AI is already configured with comprehensive system instructions for Yoruba cinema. To modify, edit the `getSystemInstruction` function in `services/aiService.ts`.

---

## Alternative Free AI Options

If Google AI Studio doesn't meet your needs, consider these alternatives:

### 1. Groq API
- **Speed:** Extremely fast
- **Models:** Llama 3, Mixtral, Gemma
- **Free Tier:** Available
- **Website:** https://groq.com/

### 2. Hugging Face Inference API
- **Models:** 200+ open-source models
- **Free Tier:** Available
- **Website:** https://huggingface.co/inference-api

### 3. Together AI
- **Models:** Multiple LLMs
- **Free Credits:** Available
- **Website:** https://together.ai/

---

## Comparison: Azure OpenAI vs Google AI Studio

| Feature | Azure OpenAI | Google AI Studio |
|---------|--------------|------------------|
| **Cost** | Paid (exhausted) | Free |
| **Setup** | Complex | Simple |
| **API Key** | Credit card required | No credit card |
| **Rate Limits** | Pay-per-use | 1,500/day free |
| **Uptime** | 99.9% | 99.9% |
| **Model Quality** | GPT-4 | Gemini 2.0 Flash |
| **Integration** | Requires changes | Already integrated |

---

## Expected Results

After implementation, you should have:

1. ✅ **Working AI Chat** - Users can ask questions about movies
2. ✅ **Movie Recommendations** - Personalized suggestions
3. ✅ **Metadata Correction** - Enhanced YouTube video info
4. ✅ **Natural Language Search** - "Find me a funny movie"
5. ✅ **Actor Information** - Details about cast members
6. ✅ **Cultural Context** - Yoruba cinema insights

---

## Support & Resources

### Official Documentation
- Google AI Studio: https://ai.google.dev/
- Gemini API Docs: https://ai.google.dev/docs
- API Reference: https://ai.google.dev/api

### Community Support
- Stack Overflow: Tag `google-gemini`
- Google AI Discord: https://discord.gg/google-ai
- GitHub Issues: Report bugs

---

## Conclusion

Google AI Studio provides a **free, reliable, and production-ready** alternative to Azure OpenAI. With just an API key and minimal configuration, you can restore all AI features to the Yorubacinemax platform at no cost.

The implementation is straightforward, the codebase already supports it, and the free tier is generous enough for production use. This solution ensures your users can enjoy AI-powered movie recommendations and assistance without any infrastructure costs.

---

**Last Updated:** October 18, 2025  
**Status:** ✅ Ready for Implementation  
**Estimated Setup Time:** 5-10 minutes

