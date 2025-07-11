import { auth } from '@/auth'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import AuthButtons from './AuthButtons'

const Navbar = async () => {
    const session = await auth();

    return (
        <header className='px-5 py-3 bg-[rgb(10,10,10)] shadow-sm font-work-sans'>
            <nav className="flex justify-between items-center px-5 py-2">
                <Link href="/">
                    <Image src="/A_Directory_Logo.png" alt='logo' width="158" height="20"/>
                </Link>

                <div className="flex items-center gap-5 text-white">
                    <AuthButtons 
                        isAuthenticated={!!session?.user}
                        userId={session?.id} 
                        sessionImg={session?.user?.image}
                    />
                </div>
            </nav>
        </header>
  )
}

export default Navbar
