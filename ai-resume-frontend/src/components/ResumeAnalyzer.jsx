import { useState } from "react"

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
      const res = await fetch("https://ai-resume-scanner-224e.onrender.com/api/analyze", {
        method: "POST",
        body: formData
      })

      const data = await res.json()
      if (!data.success) throw new Error(data.error)

      setResult(data.data)
    } catch (err) {
      setError("Something broke. Backend cried. Try again.")
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
  className={`btn-primary w-full transition-all duration-300 ${
    loading ? "animate-pulse-soft opacity-80" : "hover:scale-[1.02]"
  }`}
>
  {loading ? "Analyzing..." : "Analyze Resume"}
</button>


      {error && <p className="text-red-400 text-sm">{error}</p>}

      {result && (
        <div className="mt-8 space-y-6 animate-fade-up">
          <div className="flex items-center gap-4">
  <div className="relative w-20 h-20">
    <div className="animate-fade-up delay-100">...</div>
<div className="animate-fade-up delay-200">...</div>

    <div className="absolute inset-0 rounded-full border-4 border-white/10" />
    <div
      className="absolute inset-0 rounded-full border-4 border-green-400"
      style={{
        clipPath: `inset(${100 - result.matchScore}% 0 0 0)`
      }}
    />
    <span className="absolute inset-0 flex items-center justify-center font-bold text-lg">
      {result.matchScore}%
    </span>
  </div>

  <h2 className="text-xl font-semibold">
    Resume Match Score
  </h2>
</div>


          <div>
            <h3 className="font-semibold mb-1">Strengths</h3>
            <ul className="list-disc ml-5 text-white/80">
              {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-1">Missing Skills</h3>
            <ul className="list-disc ml-5 text-white/80">
              {result.missingSkills.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-1">Summary</h3>
            <p className="text-white/70">{result.summary}</p>
          </div>
        </div>
      )}
    </div>
  )
}
