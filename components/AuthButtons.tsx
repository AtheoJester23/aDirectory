"use client"; // Ensures this is a client component

import { CirclePlus, LogOut} from "lucide-react";
import { signIn, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function AuthButtons({ isAuthenticated, userId, sessionImg }: { 
    isAuthenticated: boolean;
    userId?: string;
    sessionImg: string;
}) {
    return (
        <>
            {isAuthenticated ? (
                <>
                    <a href="/startup/create">
                        <span className="max-sm:hidden text-[rgb(60,196,124)]">Create</span>
                        <CirclePlus className="size-6 sm:hidden"/>
                    </a>

                    <button onClick={() => signOut({redirectTo: "/"})} className="text-white hover:cursor-pointer">
                        <span className="max-sm:hidden">Logout</span>
                        <LogOut className="size-6 sm:hidden"/>
                    </button>

                    <a href={`/user/${userId}`}>
                        <Avatar className="size-10">
                            <AvatarImage src={sessionImg}/>
                            <AvatarFallback>AV</AvatarFallback>
                        </Avatar>
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
