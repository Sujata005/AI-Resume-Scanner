import ResumeAnalyzer from "./components/ResumeAnalyzer"

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-3xl w-full glass p-10">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            AI Resume Scanner
          </h1>
          <p className="text-white/70 text-lg">
            See how well your resume actually matches the job — before a recruiter ignores it.
          </p>
        </header>

        <ResumeAnalyzer />
      </div>
    </div>
  )
}

