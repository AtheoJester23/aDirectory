import { auth } from '@/auth';
import StartupForm, { pitchData } from '@/components/StartupForm'
import { client } from '@/sanity/lib/client';
import { STARTUP_BY_ID_QUERY } from '@/sanity/lib/queries';
import { redirect } from 'next/navigation';
import React from 'react'

export type paramsType = Promise<{id: string}>

const page = async ({params}: {params: paramsType}) => {
    const session = await auth();

    if(!session) redirect("/");
    
    const { id } = await params;

    console.log(id);

    const pitchDetail: pitchData = await client.fetch(STARTUP_BY_ID_QUERY, {id});
  return (
    <div>
      <StartupForm data={pitchDetail}/>
    </div>
  )
}

export default page
