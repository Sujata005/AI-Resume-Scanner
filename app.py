from flask_cors import CORS
from flask import Flask, request, jsonify
import google.generativeai as genai
from dotenv import load_dotenv
import os
import PyPDF2
import docx
import io
import json
import time

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Initialise Google Gemini
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-flash-latest')

# System prompt for resume analysis
SYSTEM_PROMPT = """
You are an AI resume evaluation engine.
You must behave deterministically and conservatively.
Your job is to compare a candidate's resume against a job description.

RULES (NON-NEGOTIABLE):
- Respond ONLY with valid JSON
- Do NOT include markdown
- Do NOT include explanations outside JSON
- Do NOT hallucinate skills not present in the resume
- If unsure, return empty arrays instead of guessing

Return JSON in this exact schema:

{
  "matchScore": number (0-100),
  "strengths": string[],
  "missingSkills": string[],
  "summary": string,
  "recommendations": string[]
}
"""



def extract_text_from_pdf(file_stream):
    """Extract text from PDF file"""
    try:
        pdf_reader = PyPDF2.PdfReader(file_stream)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        raise Exception(f"Error reading PDF: {str(e)}")


def extract_text_from_docx(file_stream):
    """Extract text from DOCX file"""
    try:
        doc = docx.Document(file_stream)
        text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        return text.strip()
    except Exception as e:
        raise Exception(f"Error reading DOCX: {str(e)}")


def extract_text_from_file(file):
    """Extract text from uploaded file based on file type"""
    filename = file.filename.lower()
    
    if filename.endswith('.pdf'):
        return extract_text_from_pdf(file.stream)
    elif filename.endswith('.docx'):
        return extract_text_from_docx(file.stream)
    elif filename.endswith('.txt'):
        return file.read().decode('utf-8')
    else:
        raise Exception("Unsupported file format. Please upload PDF, DOCX, or TXT files.")
def error_response(message, status=400):
    return jsonify({
        "success": False,
        "error": message
    }), status

@app.before_request
def start_timer():
    request.start_time = time.time()


@app.after_request
def log_request(response):
    duration = round(time.time() - request.start_time, 3)
    print(f"{request.method} {request.path} -> {response.status_code} [{duration}s]")
    return response

# NOTE: In production, this endpoint should be rate-limited (e.g., Flask-Limiter + Redis)

@app.route('/api/analyze', methods=['POST'])
def analyze_resume():
    try:
        if 'resume' not in request.files:
            return jsonify({"error": "Resume file is required"}), 400

        resume_file = request.files['resume']
        job_description = request.form.get('job_description')

        if not job_description:
            return jsonify({"error": "Job description is required"}), 400
        if len(job_description.strip()) < 50:
            return jsonify({
                "error": "Job description too short to analyze"
            }), 400

        resume_text = extract_text_from_file(resume_file)

        if not resume_text.strip():
            return jsonify({"error": "Failed to extract resume text"}), 400

        prompt = f"""
Job Description:
{job_description}

Candidate Resume:
{resume_text[:3500]}
"""

        response = model.generate_content(
            SYSTEM_PROMPT + prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.3,
                max_output_tokens=800
            )
        )

        raw_output = response.text.strip()

        # HARD validation: must be valid JSON
        try:
            parsed_output = json.loads(raw_output)
        except Exception:
            return jsonify({
                "error": "AI returned invalid JSON",
                "rawResponse": raw_output
            }), 500

        return jsonify({
            "success": True,
            "data": parsed_output
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "ok",
        "service": "AI Resume Scanner",
        "version": "1.0.0"
    }), 200
  CORS(app, resources={r"/api/*": {"origins": "*"}})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)



