"use client"

import { addComment, editComment} from '@/actions/updateAction'
import React, { useEffect, useState } from 'react'
import { pitchData } from './StartupForm'
import { nanoid } from 'nanoid'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import Link from 'next/link'
import { Session } from 'next-auth'
import { EllipsisVertical, TriangleAlert } from 'lucide-react'
import { Dialog } from '@headlessui/react'
import { deleteComment } from '@/actions/deleteAction'

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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedComment, setSelectedComment] = useState<{theSelected: string, theKey: string}>({theSelected: "", theKey: ""})
  const [currentEdit, setCurrentEdit] = useState<{_key: string, comment: string}>({_key: "", comment: ""})
  const [listen, setListen] = useState(false)

    useEffect(()=>{
        const editChoice = document.getElementById(`${selectedComment.theSelected}`);
        const iconButton = document.getElementById("ellipsisVert")

        console.log("")
        console.log("Icon Button: ")
        console.log(iconButton);
        console.log("")

        const handleClick = (e: MouseEvent) => {
            console.log(e.target);
            console.log(listen);
            if(e.target != editChoice){
                editChoice?.classList.add("invisible")
            }

            setListen(false);
            console.log("Turned to false")
        };

        document.addEventListener('click', handleClick);

        // Cleanup on unmount or when `listen` becomes false
        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, [listen, selectedComment.theSelected])

  const handleComment = (e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const theComment = document.getElementById("comment") as HTMLTextAreaElement

    if(session){
        const comment= {
            _key: nanoid(),
            author: {
                _type: 'reference',
                _ref: session.id
            },
            comment: userComment,
            status: "Done"
        };

        try {
            addComment(data._id, comment)
            setUserComment("")

            if(session.user){
                const localPitch = {...pitchStartup, comments: [...(pitchStartup.comments ?? []), {status: "Done", _key: nanoid(),author: {id: session.id, image: session.user.image ?? "", name: session.user.name ?? ""}, comment: userComment, }]}
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

  const handleCancelDel = () => {
    setIsOpen(false)
    const theComment = document.getElementById(`${selectedComment.theSelected}`)

    console.log(theComment);

    if(theComment?.classList.contains("invisible")){
        theComment?.classList.remove("invisible")
    }else{
        theComment?.classList.add("invisible")
    }
  }

  const handleOptions = (selected: string, key: string) => {
    setListen(true);

    const prevSelected = document.getElementById(`${selectedComment.theSelected}`);
    console.log("This is previous", prevSelected)

    
    prevSelected?.classList.add("invisible");


    const selectedOption = document.getElementById(`${selected}`);
    setSelectedComment({theSelected: selected, theKey: key})

    console.log("This is present: ", selectedOption);

    if(selectedOption?.classList.contains("invisible")){
        selectedOption?.classList.remove("invisible");
    }else{
        selectedOption?.classList.add("invisible");
    }
  }

  const handleEdit = (commentKey: string, status: string) => {
    const editComment = {...pitchStartup, comments: pitchStartup.comments.map(item => item._key == commentKey ? ({...item, status}) : item)}
    setPitchStartup(editComment)
    console.log(editComment);
  }

  const handleSaveEdit = (commentKey: string, comment: string) => {
    editComment(data._id, commentKey, comment);
    const saveEdit = {...pitchStartup, comments: pitchStartup.comments.map(item => item._key == commentKey ? ({...item, comment, status: "Done"}) : item)}
    setPitchStartup(saveEdit);
    setCurrentEdit({_key: "", comment: ""});

  }

  const handleDelete = () => {
    console.log("delete button clicked...")

    setIsOpen(false);

    deleteComment(data._id, selectedComment.theKey);
    setPitchStartup({...pitchStartup, comments: [...pitchStartup.comments.filter(item => item._key != selectedComment.theKey)]});

    const theComment = document.getElementById(`${selectedComment.theSelected}`)

    console.log(theComment);

    
    theComment?.classList.add("invisible")

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
                    className='text-white w-full p-3 border-b rounded'
                    onChange={(e)=>{
                        // console.log(e.target.value)

                        setUserComment(e.target.value);
                    }}
                    onKeyDown={(e)=>{
                        if(e.key == "Enter" && userComment != ""){
                            e.preventDefault();
                            handleComment(e)
                        }
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
        
        {pitchStartup.comments ? 
            pitchStartup.comments.length > 0 ? (
                <ul className='flex flex-col gap-5 mt-5'>
                    {
                        pitchStartup.comments.map((item, index) => item.status === "Done" ? (
                            <li key={index} className='flex gap-3'>
                                <Link href={`/user/${item.author.id}`}>
                                    <Avatar className="size-10">
                                        <AvatarImage src={item.author.image}/>
                                        <AvatarFallback>AV</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div className='aComment'>
                                    <div className='flex flex-col gap-1'>
                                        <Link href={`/user/${item.author.id}`} className="font-bold text-white">{item.author.name}</Link>
                                        <p className='text-white'>{item.comment}</p>
                                    </div>

                                    {item.author.id == session?.id && 
                                        <>
                                            <button onClick={()=>handleOptions(`theOptions${index}`, item._key)} id='moreOption'>
                                                <EllipsisVertical id='ellipsisVert' className='text-gray-500'/>
                                            </button>

                                            <div className='theOptions invisible' id={`theOptions${index}`}>
                                                <button onClick={()=> handleEdit(item._key, "Editing")} className='optionChoice'>Edit</button>
                                                <button onClick={()=> setIsOpen(true)} className='optionChoice'>Delete</button>
                                            </div>
                                        </>
                                    }
                                </div>
                            </li>
                        ):(
                            <div key={index} className='flex gap-3'>
                                <Link href={`/user/${item.author.id}`}>
                                    <Avatar className="size-10">
                                        <AvatarImage src={item.author.image}/>
                                        <AvatarFallback>AV</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div className='flex flex-col w-full gap-1'>
                                    <div className='flex flex-col gap-1 w-full'>
                                        <Link href={`/user/${item.author.id}`} className="font-bold text-white">{item.author.name}</Link>
                                        <textarea 
                                            onChange={(e)=> {
                                                console.log(currentEdit);
                                                setCurrentEdit({_key: item._key, comment: e.target.value});
                                            }} 
                                            onKeyDown={(e)=>{
                                                if(e.key == "Enter" && currentEdit.comment.replace(/\s+/g, "") != ""){
                                                    handleSaveEdit(item._key, currentEdit.comment)
                                                }
                                            }}
                                            name={`editComm${index}`} 
                                            id={`editComm${index}`} 
                                            defaultValue={item.comment} 
                                            className='text-white w-full p-3 border-b rounded'
                                        ></textarea>
                                    </div>
                                    <div className='flex justify-end gap-1'>
                                        <button type='button' onClick={ ()=> handleEdit(item._key, "Done") } className='text-white py-2 px-5 rounded-full hover:bg-gray-700 cursor-pointer'>Cancel</button>
                                        <button type='button' onClick={ ()=> handleSaveEdit(item._key, currentEdit.comment) } disabled={currentEdit._key != item._key || currentEdit.comment.replace(/\s+/g, "") == "" ? true : false} className={`${currentEdit._key != item._key || currentEdit.comment.replace(/\s+/g, "") == "" ? "bg-gray-500" : "bg-blue-500 cursor-pointer hover:bg-blue-400"} text-white py-2 px-5 rounded-full`}>Save</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </ul>
            ):(
                <p className='text-gray-500 mt-5'>No comments yet...</p>
            )
        :
            <p className='text-gray-500 mt-5'>No comments yet...</p>
        }

        <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
            <div className='fixed inset-0 bg-black/30'></div>

            <div className='fixed inset-0 flex w-screen items-center justify-center p-4'>
                <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-5 max-sm:w-[90%] sm:w-[50%]">
                    <div className='flex justify-center flex-col items-center gap-3'>
                        <TriangleAlert size={100} className='text-red-500'/>
                        <div className='text-center'>
                            <Dialog.Title className="text-2xl font-bold">Delete Comment</Dialog.Title>
                            <Dialog.Description className="text-gray-500">Delete your comment permanently?</Dialog.Description>
                        </div>
                        <div className='flex gap-3'>
                            <button 
                                className='px-5 py-2 bg-red-500 text-white rounded-full cursor-pointer hover:bg-red-600 duration-200 -translate-y-0.25 hover:translate-none shadow hover:shadow-none' 
                                onClick={() => handleDelete()}>
                                    Delete
                            </button>
                            <button className='px-5 py-2 bg-gray-500 text-white rounded-full cursor-pointer hover:bg-gray-600 duration-200 -translate-y-0.25 hover:translate-none shadow hover:shadow-none' onClick={() => handleCancelDel()}>Cancel</button>
                        </div>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    </section>
  )
}

export default Comments
