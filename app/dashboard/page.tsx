'use client'

import { useSession, signIn, signOut } from "next-auth/react"

export default function Dashboard() {
  const { data: session, status } = useSession()

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-xl text-white">Loading...</div>
      </div>
    )
  }

  // Not authenticated - show login page
  if (!session) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Portfolio Dashboard
              </h1>
              <p className="text-slate-400">
                Sign in to access your portfolio reports
              </p>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>

            <p className="text-xs text-center text-slate-500 mt-6">
              Secure authentication powered by Google OAuth
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Authenticated - show dashboard
  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      {/* Navigation */}
      <nav className="bg-slate-800/50 backdrop-blur border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Portfolio Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-300">
                {session.user?.name || session.user?.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4">
            Welcome, {session.user?.name}!
          </h2>
          <p className="text-slate-400 mb-6">
            Your portfolio report will appear here.
          </p>

          {/* Placeholder for portfolio report */}
          <div className="border-t border-slate-700 pt-6 mt-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-600">
                <div className="text-sm text-slate-400 mb-2">Total Pipeline</div>
                <div className="text-3xl font-bold text-blue-400">$4.8M</div>
              </div>
              <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-600">
                <div className="text-sm text-slate-400 mb-2">Quota Attainment</div>
                <div className="text-3xl font-bold text-green-400">34%</div>
              </div>
              <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-600">
                <div className="text-sm text-slate-400 mb-2">Open Deals</div>
                <div className="text-3xl font-bold text-purple-400">65</div>
              </div>
            </div>

            <p className="text-sm text-slate-500 mt-8 text-center">
              Portfolio report integration coming next...
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
