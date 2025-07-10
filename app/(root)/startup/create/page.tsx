import StartupForm from '@/components/StartupForm';
import { redirect } from 'next/navigation';
import { auth } from '@/auth'
import React from 'react'

const page = async () => {
  const session = await auth();

  if(!session) redirect("/");

  return (
    <>
      <section className="heading_container !min-h-[230px]">
        <h1 className="heading">Submit Your Startup Pitch</h1>
      </section>

      <StartupForm data={null}/>
    </>
  )
}

export default page
