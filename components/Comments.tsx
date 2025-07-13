"use client"

import { addComment, commentType } from '@/actions/updateAction'
import React, { useState } from 'react'
import { pitchData } from './StartupForm'
import { nanoid } from 'nanoid'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import Link from 'next/link'
import { Session } from 'next-auth'

export type sessionType = {
    expires: string,
    id: string,
    user: {
        email: string,
        image: string,
        name: string
    }
}

const Comments = ({data, session}: {data: pitchData, session: Session | null}) => {
  const [pitchStartup, setPitchStartup] = useState<pitchData>(data)
  const [userComment, setUserComment] = useState("")

  const handleComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const theComment = document.getElementById("comment") as HTMLTextAreaElement

    if(session){
        const comment= {
            _key: nanoid(),
            author: {
                _type: 'reference',
                _ref: session.id
            },
            comment: userComment 
        };

        try {
            addComment(data._id, comment)

            if(session.user){
                const localPitch = {...pitchStartup, comments: [...(pitchStartup.comments ?? []), {author: {id: session.id, image: session.user.image ?? "", name: session.user.name ?? ""}, comment: userComment, }]}
                console.log(localPitch);
                setPitchStartup(localPitch);
            }
        } catch (error) {
            console.error(error);
        }finally{
            theComment.value = ""
        }

        console.log(userComment);
        }
  }

  const handleCancel = () => {
    setUserComment("")

    const theComment = document.getElementById("comment") as HTMLTextAreaElement

    theComment.value = ""
  }

  return (
    <section>
        <h1 className='text-white font-bold max-sm:text-[1em] mb-3'>Comments</h1>

        {session && (
            <form onSubmit={handleComment} className='flex flex-col gap-2'>
                <textarea 
                    name="comment" 
                    id="comment" 
                    placeholder='Add a comment..' 
                    className='text-white w-full p-3'
                    onChange={(e)=>{
                        // console.log(e.target.value)

                        setUserComment(e.target.value);
                    }}
                ></textarea>
                <div className='flex justify-end gap-1'>
                    {userComment != "" && 
                        <button type='button' onClick={handleCancel} className='text-white py-2 px-5 rounded-full hover:bg-gray-700 cursor-pointer'>Cancel</button>
                    }
                    <button type='submit' disabled={userComment == "" ? true : false} className={`${userComment == "" ? "bg-gray-500" : "bg-blue-500 cursor-pointer hover:bg-blue-400"} text-white py-2 px-5 rounded-full`}>Submit</button>
                </div>
            </form>
        )}
        
        {pitchStartup.comments ? (
            <ul className='flex flex-col gap-5 mt-5'>
                {
                    pitchStartup.comments.map((item, index) => (
                        <li key={index} className='flex gap-3'>
                            <Link href={`/user/${item.author.id}`}>
                                <Avatar className="size-10">
                                    <AvatarImage src={item.author.image}/>
                                    <AvatarFallback>AV</AvatarFallback>
                                </Avatar>
                            </Link>
                            <div className='flex flex-col gap-1'>
                                <Link href={`/user/${item.author.id}`} className="font-bold text-white">{item.author.name}</Link>
                                <p className='text-white'>{item.comment}</p>
                            </div>
                        </li>
                    ))
                }
            </ul>
        ):(
            <p className='text-gray-500 mt-5'>No comments yet...</p>
        )}
    </section>
  )
}

export default Comments
