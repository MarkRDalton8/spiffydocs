'use client'

import { useState } from 'react'

export default function Home() {
  const [spiffyAcronym, setSpiffyAcronym] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateSpiffy = () => {
    const wordSets = {
      S: ['Strategic', 'Sales', 'Smart', 'Systematic', 'Streamlined', 'Superior', 'Sophisticated', 'Scalable', 'Standardized', 'Synergistic'],
      P: ['Prospect', 'Pipeline', 'Process', 'Performance', 'Predictive', 'Proactive', 'Playbook', 'Platform', 'Planning', 'Productivity'],
      I: ['Insights', 'Intelligence', 'Information', 'Innovation', 'Integration', 'Implementation', 'Infrastructure', 'Improvement', 'Impact'],
      F: ['For', 'Framework', 'Forecasting', 'Focused', 'Facilitated', 'Fast-tracked', 'Fueling', 'Foundation'],
      F2: ['Forecasting', 'Framework', 'Focused', 'Foundation', 'Facilitated', 'Fast-tracked', 'Fueling', 'For', 'Funneling'],
      Y: ['Yearly', 'Yield', 'Year-round', 'Your', 'Yielding']
    }

    setIsGenerating(true)

    setTimeout(() => {
      const result = {
        S: wordSets.S[Math.floor(Math.random() * wordSets.S.length)],
        P: wordSets.P[Math.floor(Math.random() * wordSets.P.length)],
        I: wordSets.I[Math.floor(Math.random() * wordSets.I.length)],
        F1: wordSets.F[Math.floor(Math.random() * wordSets.F.length)],
        F2: wordSets.F2[Math.floor(Math.random() * wordSets.F2.length)],
        Y: wordSets.Y[Math.floor(Math.random() * wordSets.Y.length)]
      }

      setSpiffyAcronym(result)
      setIsGenerating(false)
    }, 800)
  }

  const stats = [
    { value: '15min', label: 'Prep Time', sublabel: 'vs 2-3 hours manual' },
    { value: '93%', label: 'Time Saved', sublabel: 'on deal documentation' },
    { value: '6+', label: 'Document Types', sublabel: 'auto-generated' },
    { value: '$350K', label: 'Avg Deal Size', sublabel: 'processed' }
  ]

  return (
    <div className="bg-[#0a0e1a] text-slate-50 min-h-screen overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#0a0e1a]/80 backdrop-blur-xl border-b border-slate-800 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-mono font-bold text-lg">
              S
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight">SPIFFY</div>
              <div className="text-xs text-slate-500 font-mono">spiffydocs.ai</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_0%,transparent_80%)] opacity-30"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-block px-4 py-2 bg-blue-950/30 border border-blue-900/30 rounded-full text-sm text-blue-400 font-mono mb-8">
              ⚡ AI-Powered Sales Intelligence
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              Transform Call Transcripts Into
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Revenue Intelligence
              </span>
            </h1>

            <p className="text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              SPIFFY automatically converts your Gong calls and Salesforce data into actionable sales documents.
              Reduce prep time from <span className="text-blue-400 font-semibold">hours to minutes</span>.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 mb-20">
              <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl text-lg font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all flex items-center gap-2">
                Start Free Trial →
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="border border-slate-700 bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-xl p-6 text-center hover:-translate-y-1 transition-transform"
                >
                  <div className="text-3xl md:text-4xl font-bold mb-2 font-mono text-blue-400">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-slate-300 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-slate-500">
                    {stat.sublabel}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#0a0e1a] to-[#0f1420]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Built for Salespeople
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                by Salespeople
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Over 40 years of combined frontline sales experience. We've felt the pain. We built the solution.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            <div className="border border-slate-700 bg-gradient-to-br from-slate-900/80 to-slate-800/50 rounded-2xl p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                MD
              </div>
              <h3 className="text-2xl font-bold mb-2 text-center">Mark Dalton</h3>
              <p className="text-blue-400 text-center mb-4 font-semibold">Co-Founder</p>
              <p className="text-slate-400 leading-relaxed">
                20+ years in presales and solutions engineering. Mark knows the 2-3 hour prep grind before every call.
                He built SPIFFY to get those hours back and help SEs focus on what matters: winning deals.
              </p>
            </div>

            <div className="border border-slate-700 bg-gradient-to-br from-slate-900/80 to-slate-800/50 rounded-2xl p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                TT
              </div>
              <h3 className="text-2xl font-bold mb-2 text-center">Todd Trippany</h3>
              <p className="text-purple-400 text-center mb-4 font-semibold">Co-Founder</p>
              <p className="text-slate-400 leading-relaxed">
                20+ years as an Account Executive carrying quota and closing deals. Todd understands the chaos of managing
                multiple opportunities and the need for instant intelligence on every account.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="text-4xl font-bold mb-2 font-mono text-blue-400">40+</div>
              <div className="text-slate-400 text-sm">Years Combined Sales Experience</div>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold mb-2 font-mono text-purple-400">1000s</div>
              <div className="text-slate-400 text-sm">of Deals Closed</div>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold mb-2 font-mono text-pink-400">93%</div>
              <div className="text-slate-400 text-sm">Time Saved on Prep</div>
            </div>
          </div>
        </div>
      </section>

      {/* SPIFFY Acronym Generator */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Make SPIFFY
              <br />
              <span className="text-slate-600">Your Own</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Generate your own SPIFFY acronym. Because every sales team deserves their own take on intelligence.
            </p>
          </div>

          <div className="border border-slate-700 bg-gradient-to-br from-slate-900/80 to-slate-800/50 rounded-2xl p-8 text-center">
            {!spiffyAcronym ? (
              <div>
                <div className="text-5xl md:text-6xl font-black mb-8 font-mono">
                  ✨ SPIFFY ✨
                </div>
                <button
                  onClick={generateSpiffy}
                  disabled={isGenerating}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-xl text-lg font-semibold shadow-lg shadow-blue-500/30 transition-all inline-flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      ⚡ Generate My SPIFFY
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl font-black mb-6 font-mono">
                  ✨ SPIFFY ✨
                </div>
                <div className="border-t border-b border-slate-700 py-6 mb-8">
                  <div className="text-2xl md:text-3xl font-bold leading-relaxed">
                    <span className="text-blue-400">{spiffyAcronym.S}</span>{' '}
                    <span className="text-purple-400">{spiffyAcronym.P}</span>{' '}
                    <span className="text-pink-400">{spiffyAcronym.I}</span>{' '}
                    <span className="text-cyan-400">{spiffyAcronym.F1}</span>{' '}
                    <span className="text-orange-400">{spiffyAcronym.F2}</span>{' '}
                    <span className="text-green-400">{spiffyAcronym.Y}</span>
                  </div>
                </div>
                <div className="flex gap-4 justify-center flex-wrap">
                  <button
                    onClick={generateSpiffy}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-all flex items-center gap-2"
                  >
                    ⚡ Generate Another
                  </button>
                  <button
                    onClick={() => {
                      const text = `✨ SPIFFY ✨\n${spiffyAcronym.S} ${spiffyAcronym.P} ${spiffyAcronym.I} ${spiffyAcronym.F1} ${spiffyAcronym.F2} ${spiffyAcronym.Y}`
                      navigator.clipboard.writeText(text)
                    }}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-all"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              </div>
            )}
          </div>

          <p className="text-center text-slate-500 text-sm mt-6">
            Pro tip: Use your custom SPIFFY in team meetings, Slack channels, or email signatures 🚀
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-950/30 to-purple-950/30 border-t border-b border-slate-800">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Ready to 10X Your
            <br />
            Sales Intelligence?
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            Join forward-thinking revenue teams using SPIFFY to automate their sales documentation.
          </p>
          <div className="flex flex-col items-center gap-4">
            <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl text-lg font-semibold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2">
              Start Free Trial →
            </button>
          </div>
          <p className="text-sm text-slate-500 mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-mono font-bold">
                  S
                </div>
                <div className="text-xl font-bold">SPIFFY</div>
              </div>
              <p className="text-sm text-slate-400">
                AI-powered sales intelligence for modern revenue teams.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="text-sm text-slate-400 space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="text-sm text-slate-400 space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="text-sm text-slate-400 space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
            <p>© 2026 SPIFFY. All rights reserved. <span className="font-mono">spiffydocs.ai</span></p>
          </div>
        </div>
      </footer>
    </div>
  )
}
