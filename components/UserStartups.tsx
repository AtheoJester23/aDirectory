import { client } from '@/sanity/lib/client'
import { STARTUPS_BY_AUTHOR_QUERY } from '@/sanity/lib/queries'
import React, { Suspense } from 'react'
import StartupCard, { StartupTypeCard } from './StartupCard'

const UserStartups = async ({id}: {id: string}) => {

  const startups = await client.fetch(STARTUPS_BY_AUTHOR_QUERY, {id})
  
  return (
    <>
      {startups.length > 0 ? (
        startups.map((startup: StartupTypeCard) => (
            <StartupCard prop={startup} key={startup._id}/>
        ))
        ) : (
            <Suspense fallback={<p>Loading...</p>}>
                <p className='no-result'>No post yet...</p>
            </Suspense>
        )}
    </>
  )
}

export default UserStartups
