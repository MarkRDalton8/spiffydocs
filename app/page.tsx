import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-white mb-6">
            SPIFFY
          </h1>
          <p className="text-2xl text-blue-200 mb-4">
            AI-Powered Sales Intelligence
          </p>
          <p className="text-lg text-gray-300 mb-12">
            Transform call transcripts into revenue intelligence. Reduce sales prep time from hours to minutes.
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Access Portfolio Dashboard →
            </Link>
          </div>

          <div className="mt-16 p-8 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Portfolio Dashboard</h2>
            <p className="text-gray-300 mb-4">
              Secure, authenticated access to your sales portfolio reports and analytics.
            </p>
            <ul className="text-left text-gray-300 space-y-2 max-w-md mx-auto">
              <li>✓ Real-time portfolio metrics</li>
              <li>✓ Salesforce data integration</li>
              <li>✓ Secure authentication</li>
              <li>✓ Executive-ready reports</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
