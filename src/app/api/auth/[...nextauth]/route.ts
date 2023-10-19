import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

async function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Karl" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "password",
        },
      },
      // and adding a fake authorization with static username and password:
      async authorize(credentials) {
        if (
          credentials!.username === "Karl" &&
          credentials!.password === "password"
        ) {
          return {
            id: "1",
            name: "Karl",
            email: "karl@fakelogin",
          };
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, trigger, account }) {
      if (account) {
        // return without delay on initial sign in
        return {
          ...token,
          accessToken: crypto.randomUUID(),
          refreshToken: crypto.randomUUID(),
          tokenVersion: 1,
        };
      }

      if (trigger === "update") {
        // simulate token refresh and return without delay
        return {
          ...token,
          accessToken: crypto.randomUUID(),
          refreshToken: crypto.randomUUID(),
          tokenVersion: token.tokenVersion + 1,
        };
      }

      // simulate slow response from server
      await wait(1000);

      return token;
    },
    async session({ session, token }) {
      // Expose token version to client for demonstration purposes
      session.tokenVersion = token.tokenVersion;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
