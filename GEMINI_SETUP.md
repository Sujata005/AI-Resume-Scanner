# How to Get Your Free Google Gemini API Key

Google Gemini offers a generous **FREE tier** for developers. Follow these steps to get your API key:

## Step-by-Step Instructions

1. **Go to Google AI Studio**
   - Visit: https://aistudio.google.com/app/apikey
   - Or: https://makersuite.google.com/app/apikey

2. **Sign in with your Google Account**
   - Use any Gmail account
   - No credit card required!

3. **Create API Key**
   - Click "Create API Key" button
   - Select "Create API key in new project" (or choose existing project)
   - Your API key will be generated instantly

4. **Copy the API Key**
   - Copy the generated API key (starts with something like `AIza...`)

5. **Add to Your .env File**
   - Open the `.env` file in your project root
   - Replace `your_key_here` with your actual API key:
   ```
   GEMINI_API_KEY=AIzaSyC-your-actual-api-key-here
   ```

6. **Test the Connection**
   - Run the test script:
   ```bash
   python test_gemini.py
   ```
   - You should see: "✓ Google Gemini connection successful!"

## Free Tier Limits

Google Gemini's free tier includes:
- ✅ **60 requests per minute**
- ✅ **1,500 requests per day**
- ✅ **No credit card required**
- ✅ **Completely FREE**

This is more than enough for personal projects and testing!

## Troubleshooting

### Error: "API key not valid"
- Make sure you copied the entire API key
- Check that there are no extra spaces in the `.env` file
- Ensure the key starts with `AIza`

### Error: "API key not found"
- Make sure your `.env` file is in the project root directory
- Restart the Flask application after updating `.env`

### Need More Quota?
- The free tier is usually sufficient for development
- If you need more, you can upgrade to a paid plan at https://cloud.google.com/vertex-ai/pricing

## Benefits of Using Gemini

- 🆓 **Completely FREE** - No credit card needed
- 🚀 **Fast responses** - Quick inference times
- 🎯 **High quality** - Excellent for text analysis
- 💰 **Generous limits** - 1,500 requests per day

Enjoy your free AI-powered resume scanner!
