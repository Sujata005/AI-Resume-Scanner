from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
from dotenv import load_dotenv
import os
import PyPDF2
import docx
import io

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Initialize Google Gemini
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-flash-latest')

# System prompt for resume analysis
SYSTEM_PROMPT = """You are a professional career advisor analyzing a candidate's qualifications for a job position.

Provide your analysis in this exact format:

**SCORE: X/100**

**STRONG SUITES:**
- [Point 1]
- [Point 2]
- [Point 3]

**WEAK AREAS:**
- [Point 1]
- [Point 2]

**RECOMMENDATIONS FOR IMPROVEMENT:**
- [Point 1]
- [Point 2]
- [Point 3]

Be specific and constructive."""


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


@app.route('/')
def index():
    """Serve the main page"""
    return render_template('index.html')


@app.route('/analyze', methods=['POST'])
def analyze_resume():
    """Analyze resume against job requirements"""
    try:
        # Check if resume file is provided
        if 'resume' not in request.files:
            return jsonify({'error': 'No resume file provided'}), 400
        
        resume_file = request.files['resume']
        job_requirements = request.form.get('job_requirements', '')
        
        if resume_file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not job_requirements:
            return jsonify({'error': 'Job requirements are required'}), 400
        
        # Extract text from resume
        resume_text = extract_text_from_file(resume_file)
        
        if not resume_text:
            return jsonify({'error': 'Could not extract text from resume'}), 400
        
        # Create analysis prompt - keep it simple to avoid safety triggers
        analysis_prompt = f"""Compare these qualifications against the job requirements and provide feedback:

Job Requirements:
{job_requirements}

Candidate's Qualifications:
{resume_text[:3000]}

Provide analysis with score, strengths, gaps, and suggestions for improvement."""
        
        # Call Google Gemini API with safety settings
        full_prompt = f"{SYSTEM_PROMPT}\n\n{analysis_prompt}"
        
        # Configure safety settings to be more permissive for resume analysis
        safety_settings = [
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
        ]
        
        response = model.generate_content(
            full_prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.7,
                max_output_tokens=1500,
            ),
            safety_settings=safety_settings
        )
        
        # Extract AI analysis with error handling
        try:
            analysis = response.text
        except ValueError as e:
            # If response was blocked, check the reason
            if hasattr(response, 'candidates') and response.candidates:
                candidate = response.candidates[0]
                if hasattr(candidate, 'finish_reason'):
                    finish_reason = candidate.finish_reason
                    if finish_reason == 2:  # SAFETY
                        analysis = "**Analysis Note**: The AI safety filters were triggered. This typically happens with certain content. Please try rephrasing or using a different resume format.\n\n**Suggestion**: Remove any sensitive information and try again."
                    else:
                        analysis = f"**Error**: Unable to generate analysis (finish_reason: {finish_reason}). Please try again with different content."
                else:
                    analysis = "**Error**: Unable to generate analysis. Please try again."
            else:
                raise e
        
        return jsonify({
            'success': True,
            'analysis': analysis,
            'resume_preview': resume_text[:500] + '...' if len(resume_text) > 500 else resume_text
        })
    
    except Exception as e:
        import traceback
        print(f"Error: {str(e)}")
        print(traceback.format_exc())
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
