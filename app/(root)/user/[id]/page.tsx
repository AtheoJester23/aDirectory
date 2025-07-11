import { auth } from '@/auth';
import UserStartups from '@/components/UserStartups';
import { client } from '@/sanity/lib/client';
import { AUTHOR_BY_GOOGLE_ID_QUERY } from '@/sanity/lib/queries';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import React from 'react'

const page = async ({params}: {params: Promise<{id: string}>}) => {
  const id = (await params).id;
  const session = await auth();

  const user = await client.fetch(AUTHOR_BY_GOOGLE_ID_QUERY, {id})
  if(!user) return notFound();

  
  return (
    <>
      <section className="profile_container">
        <div className="profile_card">
          <div className="profile_title">
            <h3 className='text-[24px] uppercase text-center line-clamp-1'>
              {user?.name}
            </h3>
          </div>

          <Image
            src={user.image}
            alt={user.name}
            width={220}
            height={220}
            className='profile_image'
          />

          <p className='text-[30px] font-extrabold mt-7 text-center text-[rgba(255,255,255,0.8)]'>
            {user?.username == "" ? "" : `@${user.username}`}
          </p>
          <p className="mt-1 text-center text-[14px] font-normal text-gray-300">
            {user?.bio ?? "Bio"}
          </p>
        </div>

        <hr className='text-[rgb(10,10,10)]'/>

        <div className="flex-1 flex flex-col gap-5 lg:mt-2">
          <p className='text-[30px] font-bold text-[rgba(255,255,255,0.8)] mb-5'>
            {session?.id == id ? "Your" : "All"} Startups
          </p>

          <ul className='card_grid-sm'>
            <UserStartups id={id}/>
          </ul>
        </div>
      </section>
    </>
  )
}

export default page
