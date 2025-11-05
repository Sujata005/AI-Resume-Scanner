import google.generativeai as genai
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Configure API
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

print("Available Gemini models:\n")
try:
    for model in genai.list_models():
        if 'generateContent' in model.supported_generation_methods:
            print(f"✓ {model.name}")
            print(f"  Display Name: {model.display_name}")
            print(f"  Description: {model.description}")
            print()
except Exception as e:
    print(f"Error: {e}")
    import traceback
    print(traceback.format_exc())
