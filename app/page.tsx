import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-slate-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-blue-600/10"></div>

        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo/Title */}
            <div className="mb-8 animate-fade-in">
              <h1 className="text-7xl font-black tracking-tight mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                SPIFFY
              </h1>
              <p className="text-xl text-blue-300 font-mono">
                AI-Powered Sales Intelligence Platform
              </p>
            </div>

            {/* Tagline */}
            <p className="text-2xl text-slate-300 mb-12 leading-relaxed">
              Transform call transcripts into revenue intelligence.<br/>
              <span className="text-blue-400">Reduce sales prep time from hours to minutes.</span>
            </p>

            {/* CTA Button */}
            <Link
              href="/dashboard"
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
            >
              Access Portfolio Dashboard →
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            Powerful Features
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-3 text-white">Real-time Analytics</h3>
              <p className="text-slate-400">
                Live portfolio metrics and Salesforce data integration for instant insights.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-3 text-white">Secure Access</h3>
              <p className="text-slate-400">
                Enterprise-grade authentication with Google OAuth for maximum security.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-bold mb-3 text-white">Executive Reports</h3>
              <p className="text-slate-400">
                Beautiful, executive-ready portfolio reports with quota tracking.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="container mx-auto px-4 text-center text-slate-500">
          <p>© 2026 SPIFFY - AI-Powered Sales Intelligence Platform</p>
        </div>
      </footer>
    </div>
  )
}
