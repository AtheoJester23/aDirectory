import { auth } from '@/auth'
import { signIn, signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import AuthButtons from './AuthButtons'

const Navbar = async () => {
    const session = await auth();

    return (
        <header className='px-5 py-3 bg-black shadow-sm font-work-sans'>
            <nav className="flex justify-between items-center px-5 py-2">
                <Link href="/">
                    <Image src="/logo3.png" alt='logo' width="170" height="32"/>
                </Link>

                <div className="flex items-center gap-5 text-white">
                    <AuthButtons 
                        isAuthenticated={!!session?.user}
                        userId={session?.user?.id} 
                        userName={session?.user?.name}
                    />
                </div>
            </nav>
        </header>
  )
}

export default Navbar
