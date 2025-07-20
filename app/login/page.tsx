"use client";
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/account');
        }
    }, [status, router]);

    return (
        <main className="max-w-md mx-auto py-16 px-4 text-center">
            <h1 className="text-2xl font-bold mb-6">Sign In</h1>
            <button
                onClick={() => signIn('google')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Sign in with Google
            </button>
        </main>
    );
} 