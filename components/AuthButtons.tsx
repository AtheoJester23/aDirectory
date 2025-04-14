"use client"; // Ensures this is a client component

import { signIn, signOut } from "next-auth/react";

export default function AuthButtons({ isAuthenticated, userId, userName }: { 
    isAuthenticated: boolean;
    userId?: string;
    userName?: string;
}) {
    return (
        <>
            {isAuthenticated ? (
                <>
                    <a href="/startup/create">
                        <span>Create</span>
                    </a>

                    <button onClick={() => signOut({redirectTo: "/"})} className="text-white hover:cursor-pointer">
                        Logout
                    </button>

                    <a href={`/user/${userId}`}>
                        <span>{userName}</span>
                    </a>
                </>
            ) : (
                <button onClick={() => signIn("google")} className="text-white hover:cursor-pointer">
                    Login
                </button>
            )}
        </>
    );
}
