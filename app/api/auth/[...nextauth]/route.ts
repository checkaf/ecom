import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        // Add EmailProvider or CredentialsProvider here if needed
    ],
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
    },
});

export { handler as GET, handler as POST }; 