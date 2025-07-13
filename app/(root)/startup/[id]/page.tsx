import { formatDate } from '@/lib/utils'
import { client } from '@/sanity/lib/client'
import { PLAYLIST_BY_SLUG_QUERY, STARTUP_BY_ID_QUERY } from '@/sanity/lib/queries'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'
import markdownit from 'markdown-it'
import { Skeleton } from '@/components/ui/skeleton'
import View from '@/components/View'
import StartupCard, { StartupTypeCard } from '@/components/StartupCard'
import ActionButtons from '@/components/ActionButtons'
import { auth } from '@/auth'
import Image from 'next/image'
import Votes from '@/components/Votes'

const md = markdownit();

const page = async ({params}: {params: Promise<{id: string}>}) => {
  const session = await auth();
  
  const id = (await params).id

  //Example of a parallel request:
  const [post, { select: editorPosts }] = await Promise.all([
    await client.fetch(STARTUP_BY_ID_QUERY, {id}),
    await client.fetch(PLAYLIST_BY_SLUG_QUERY, {slug: 'editor-picks'})
  ])

  if(!post) return notFound();

  const parsedContent = md.render(post?.pitch || null);

  console.log("This is the id: ", post.author);

  return (
    <div>
      <section className="heading_container !min-h-[230px]">
        <p className="tag">{formatDate(post?._createdAt)}</p>
        
        {post.author.id === session?.id && <ActionButtons id={id}/>}

        <h1 className='heading'>{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>

      </section>

      <section className='section_container'>
        <Image src={post.image} alt='thumbnail' className='w-full h-auto rounded-xl' width={0} height={0} sizes='100vw'/>
        
        <Votes data={post} id={session?.id ?? null}/>

        <div className="space-y-5 max-w-4xl mx-auto">
            <div className="flex-between gap-5">
                <Link href={`/user/${post.author?.id}`} className='flex gap-2 items-center mb-3 hover:-translate-y-0.5 hover:shadow-xl p-5 rounded-b-xl duration-150'>
                    <Image src={post.author.image} alt="avatar" width={64} height={64} className='rounded-full shadow-lg me-2'/>
                
                    <div>
                        <p className='text-[20px] font-work-sans font-medium text-white text-shadow-lg'>{post?.author?.name}</p>
                        <p className='text-[17px] font-work-sans font-normal text-gray-500'>@{post?.author?.username}</p>
                    </div>
                </Link>

                <p className="category-tag">{post?.category}</p>
            </div>

            <h3 className='text-[30px] font-bold text-center text-[rgb(29,185,84)]'>Pitch Details</h3>

            {parsedContent ? (
                <article className='prose prose-invert max-w-4xl font-work-sans break-all' dangerouslySetInnerHTML={{__html: parsedContent}}/>
            ) : (
                <p className="no-result">No Details Provided...</p>
            )}
        </div>

        <hr className="divider"/>

        {editorPosts?.length > 0 && (
          <div className='max-w-4xl mx-auto'>
            <p className="font-semibold text-[30px] text-[rgb(29,185,84)]">
              Editor Picks
            </p>

            <ul className="mt-7 card_grid-sm">
              {editorPosts.map((post: StartupTypeCard, index: number) => (
                <StartupCard key={index} prop={post}/>
              ))}
            </ul>
          </div>
        )}

        <Suspense fallback={<Skeleton className='view_skeleton'/>}>
            <View id={id}/>
        </Suspense>      
      </section>
    </div>
  )
}

export default page
