# AI Resume Scanner

An intelligent resume analysis tool that scans resumes against job requirements and provides comprehensive feedback with ratings, strengths, weaknesses, and improvement recommendations.

## Features

- **Resume Upload**: Support for PDF, DOCX, and TXT formats
- **Drag & Drop**: Easy file upload with drag-and-drop functionality
- **AI Analysis**: Powered by Google Gemini Pro for intelligent resume evaluation (FREE tier available)
- **Comprehensive Scoring**: Get a score out of 100 for resume-job match
- **Detailed Feedback**:
  - **Strong Suites**: Specific strengths aligned with job requirements
  - **Weak Areas**: Identified gaps and areas needing improvement
  - **Recommendations**: Actionable suggestions for resume enhancement
- **Dark Mode**: Eye-friendly theme toggle
- **Responsive Design**: Works seamlessly on desktop and mobile

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd ai-chat-assistant
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**:
   - Create a `.env` file in the root directory
   - Add your Google Gemini API key:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```
   - Get your FREE API key from: https://aistudio.google.com/app/apikey

## Usage

1. **Start the application**:
   ```bash
   python app.py
   ```

2. **Open your browser**:
   Navigate to `http://localhost:5000`

3. **Analyze a resume**:
   - Upload a resume (PDF, DOCX, or TXT)
   - Paste the job description/requirements
   - Click "Analyze Resume"
   - Review the detailed analysis with score and recommendations

## File Structure

```
ai-chat-assistant/
│
├── app.py                 # Flask backend with resume analysis logic
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables (create this)
├── .env.example          # Example environment file
│
├── templates/
│   └── index.html        # Main HTML template
│
└── static/
    ├── style.css         # Styling for the application
    └── script.js         # Frontend JavaScript logic
```

## Technologies Used

- **Backend**: Flask (Python)
- **AI**: Google Gemini Pro (FREE tier available)
- **Document Processing**: PyPDF2, python-docx
- **Frontend**: HTML, CSS, JavaScript
- **Styling**: Custom CSS with dark mode support

## API Endpoints

### `GET /`
Serves the main application page.

### `POST /analyze`
Analyzes uploaded resume against job requirements.

**Request**:
- `resume`: File (multipart/form-data)
- `job_requirements`: String

**Response**:
```json
{
  "success": true,
  "analysis": "Detailed analysis text",
  "resume_preview": "First 500 characters of resume"
}
```

## Configuration

- **Max File Size**: 16MB (configurable in `app.py`)
- **Supported Formats**: PDF, DOCX, TXT
- **AI Model**: Google Gemini Pro (free tier available)
- **Max Output Tokens**: 1500 (configurable for longer/shorter responses)

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## License

MIT License - feel free to use this project for personal or commercial purposes.

Perfect for local testing and portfolio demos!

## Security Notes

- Never commit your `.env` file
- Keep your API key private
- Use environment variables for all secrets

