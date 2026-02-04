import { useState } from "react"

const API_BASE = import.meta.env.VITE_API_BASE_URL

export default function ResumeAnalyzer() {
  const [resume, setResume] = useState(null)
  const [jobDesc, setJobDesc] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!resume || jobDesc.length < 50) {
      setError("Upload a resume and add a proper job description.")
      return
    }

    setError("")
    setLoading(true)
    setResult(null)

    const formData = new FormData()
    formData.append("resume", resume)
    formData.append("job_description", jobDesc)

    try {
      const res = await fetch(`${API_BASE}/api/analyze`, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Server error")

      const data = await res.json()
      if (!data.success) throw new Error(data.error)

      setResult(data.data)
    } catch (err) {
      setError("Analysis failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <input
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={(e) => setResume(e.target.files[0])}
        className="input w-full"
      />

      <textarea
        rows="6"
        placeholder="Paste the job description here..."
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
        className="input w-full resize-none"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {result && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">
            Match Score: {result.matchScore}%
          </h2>

          <div>
            <h3 className="font-semibold">Strengths</h3>
            <ul className="list-disc ml-5">
              {result.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Missing Skills</h3>
            <ul className="list-disc ml-5">
              {result.missingSkills.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <p>{result.summary}</p>
        </div>
      )}
    </div>
  )
}
