import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
export default {
  providers: [
    GoogleProvider({
      clientId: String(process.env.GOOGLE_CLIENT_ID),
      clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "text",
        },
        password: {
          label: "password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        try {
          const res = await fetch(
            `${process.env.API_URL}/user/login`,
            {
              method: "POST",
              body: JSON.stringify(credentials),
              headers: { "Content-Type": "application/json" },
            }
          );
      
          const user = await res.json();
          if (res.ok && !user?.error) {
            return user;
          } else {
            console.error("Login error:", user.error);
            return null;
          }
        } catch (error) {
          console.error("Fetch error:", error);
          return null;
        }
      }
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, token, user }) {
      if(token.provider)
        session.provider = token.provider;
      session.user.role = token.role;
      if(token.role == "vendor")
        session.user.isVendorRegistered = token.isVendorRegistered;

      return session;
    },
    async jwt({ token, user, account }) {
      
      if (account) {
        if(account.provider && account.provider == "google"){
          const response = await fetch(`${process.env.API_URL}/vendor?email=${user.email}`)
          if (response.ok) {
            token.isVendorRegistered = true;
          } else {
            token.isVendorRegistered = false;
          }
          token.role = "vendor";
        }else
          token.role = "admin";

        token.provider = account.provider;
      }

      return token;
    },
  },
  pages: {
    signIn: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET,
};