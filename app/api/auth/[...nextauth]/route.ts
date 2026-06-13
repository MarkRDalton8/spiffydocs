import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Whitelist: only allow specific email addresses
      const allowedEmailsEnv = process.env.ALLOWED_EMAILS || 'markrdalton8@gmail.com,mark@spiffydocs.ai,admin@spiffydocs.ai'
      const allowedEmails = allowedEmailsEnv.split(',').map(e => e.trim().toLowerCase())

      const email = user.email?.toLowerCase() || ''

      if (allowedEmails.includes(email)) {
        return true // Allow sign in
      }

      console.log(`Sign-in denied for email: ${email}`)
      return false // Deny sign in
    },
    async session({ session }) {
      return session
    },
  },
})

export { handler as GET, handler as POST }
