import google.generativeai as genai
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Test Gemini connection
try:
    genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
    model = genai.GenerativeModel('models/gemini-2.5-flash')
    
    response = model.generate_content("Say hello!")
    
    print("✓ Google Gemini connection successful!")
    print(f"Response: {response.text}")
    
except Exception as e:
    print(f"✗ Gemini connection failed: {str(e)}")
    import traceback
    print(traceback.format_exc())
