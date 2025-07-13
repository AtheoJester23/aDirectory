"use client"

import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import React, { useState } from 'react'
import { pitchData } from './StartupForm'
import { nanoid } from 'nanoid'
import { signIn } from 'next-auth/react'
import { addVote, changeVote, removeVote} from '@/actions/updateAction'

const Votes = ({data, id}: {data: pitchData, id: string | null}) => {
  const [pitchStartup, setPitchStartup] = useState<pitchData>(data);
  const [upvoteCount, setUpVoteCount] = useState<number>(data.upvotes?.length ?? 0)
  const [picked, setPicked] = useState<string>(data.upvotes ? data.upvotes[data.upvotes.findIndex(item => item.id == id)]?.id ? "agree" : data.downvotes ? data.downvotes[data.downvotes.findIndex(item => item.id == id)]?.id ? "disagree" : "" : "" : "");
  const [downvoteCount, setDownvotecount] = useState<number>(data.downvotes?.length ?? 0);

  const handleUpvote = () => {
    if(!id){
        return signIn("google", {redirectTo: "/"}, { prompt: "select_account" })
    }

    //If there's no upvote yet
    if(!pitchStartup.upvotes){
        //If the user didnt vote yet
        if(picked == ""){
            setUpVoteCount(upvoteCount + 1)
            setPicked("agree");
            const addUpVote = {...pitchStartup, upvotes: [{_key: nanoid(), id}]}

            setPitchStartup(addUpVote);
            addVote(data._id, id, "upvotes");

            console.log(addUpVote);
            console.log("One")
        }
        //if the user voted disagree
        else if(picked == "disagree"){
            setUpVoteCount(upvoteCount + 1);
            setDownvotecount(downvoteCount - 1);
            setPicked("agree");
            const addRem = {...pitchStartup, upvotes: [{_key: nanoid(), id}], downvotes: pitchStartup.downvotes.filter(item => item.id != id)}

            //add upvote and remove downvote
            setPitchStartup(addRem);
            changeVote(data._id, id, "upvotes")

            console.log({...pitchStartup, upvotes: [{_key: nanoid(), id}], downvotes: pitchStartup.downvotes.filter(item => item.id != id)});
            console.log("Two")
        }
    //If there's upvote
    }else{
        //If the user didnt vote yet
        if(picked == ""){
            setUpVoteCount(upvoteCount + 1)
            setPicked("agree");
            const addNew = {...pitchStartup, upvotes: [...pitchStartup.upvotes, {_key: nanoid(), id}]}
            setPitchStartup(addNew);
            
            addVote(data._id, id, "upvotes");

            console.log({...pitchStartup, upvotes: [...pitchStartup.upvotes, {_key: nanoid(), id}]});
        
            console.log("three")
        //if the user remove their agree vote
        }else if(picked == "agree" && pitchStartup.upvotes.some(item => item.id === id)){
            setUpVoteCount(upvoteCount - 1)
            setPicked("");
            const addRem2 = {...pitchStartup, upvotes: pitchStartup.upvotes.filter(item => item.id != id)}

            setPitchStartup(addRem2);


            removeVote(data._id, id, "upvotes")


            console.log({...pitchStartup, upvotes: pitchStartup.upvotes.filter(item => item.id != id)});
        
            console.log("four")
        //if the user voted disagree
        }else if(picked == "disagree"){
            setUpVoteCount(upvoteCount + 1);
            setDownvotecount(downvoteCount - 1);
            setPicked("agree");
            const addRem3 = {...pitchStartup, upvotes: [...pitchStartup.upvotes, {_key: nanoid(), id}], downvotes: pitchStartup.downvotes.filter(item => item.id != id)}

            //add upvote and remove downvote
            setPitchStartup(addRem3);
            changeVote(data._id, id, "upvotes");

            console.log({...pitchStartup, upvotes: [...pitchStartup.upvotes, {_key: nanoid(), id}], downvotes: pitchStartup.downvotes.filter(item => item.id != id)});
            console.log("five")
        }
    }
  }

  const handleDownvote = () => {
    if(!id){
        return signIn("google", {redirectTo: "/"}, { prompt: "select_account" })
    }

    console.log("This is the length of downvotes: ", data.downvotes?.length == null);

    if(!pitchStartup.downvotes){
        if(picked == ""){
            setDownvotecount(downvoteCount + 1)
            setPicked("disagree")
            const addNewA = {...pitchStartup, downvotes: [{_key: nanoid(), id}]}

            setPitchStartup(addNewA);
            addVote(data._id, id, "downvotes");

            console.log({...pitchStartup, downvotes: [{_key: nanoid(), id}]});
            console.log("From A");
        }else if(picked == "agree"){
            setUpVoteCount(upvoteCount - 1);
            setDownvotecount(downvoteCount + 1);
            setPicked("disagree");
            const addRemA = {...pitchStartup, upvotes: pitchStartup.upvotes.filter(item => item.id != id), downvotes: [{_key: nanoid(), id}]}

            //add downvote and remove upvote
            setPitchStartup(addRemA);
            changeVote(data._id, id, "downvotes");

            console.log({...pitchStartup, upvotes: pitchStartup.upvotes.filter(item => item.id != id), downvotes: [{_key: nanoid(), id}]});
            console.log("From B");
        }
    }else{
        //If the user didnt vote yet
        if(picked == ""){
            setDownvotecount(downvoteCount + 1)
            setPicked("disagree");
            const addNewB = {...pitchStartup, downvotes: [...pitchStartup.downvotes, {_key: nanoid(), id}]}
            
            setPitchStartup(addNewB);
            addVote(data._id, id, "downvotes");

            console.log({...pitchStartup, downvotes: [{_key: nanoid(), id}]});
            console.log("From C");
        //if the user voted agree
        }else if(picked == "disagree" && pitchStartup.downvotes.some(item => item.id === id)){
            setDownvotecount(downvoteCount - 1)
            setPicked("");
            const addRemB = {...pitchStartup, downvotes: pitchStartup.downvotes.filter(item => item.id != id)}
            setPitchStartup(addRemB);

            removeVote(data._id, id, "downvotes")

            console.log({...pitchStartup, downvotes: pitchStartup.downvotes.filter(item => item.id != id)});
            console.log("From D");
        //if the user voted disagree
        }else if(picked == "agree"){
            setUpVoteCount(upvoteCount - 1);
            setDownvotecount(downvoteCount + 1);
            setPicked("disagree");
            const addRemC = {...pitchStartup, upvotes: pitchStartup.upvotes.filter(item => item.id != id), downvotes: [...pitchStartup.downvotes, {_key: nanoid(), id}]}

            //add downvote and remove upvote
            setPitchStartup(addRemC);
            changeVote(data._id, id, "downvotes")

            console.log({...pitchStartup, upvotes: pitchStartup.upvotes.filter(item => item.id != id), downvotes: [...pitchStartup.downvotes, {_key: nanoid(), id}]});
            console.log("From E");
        }
    }
  }

  return (
    <div className='flex justify-center items-center text-white mt-5'>
        <div className='flex gap-1'>
            <button onClick={() => handleUpvote()} className={`bg-[rgb(30,30,30)] py-2 px-5 rounded-s-full flex justify-center items-center gap-1 cursor-pointer hover:bg-[rgb(45,45,45)] ${picked === "agree" ? "text-green-500" : null}`}>
                <ArrowBigUp/>
                <p>{upvoteCount}</p>
            </button>
            <button onClick={() => handleDownvote()} className={`bg-[rgb(30,30,30)] py-2 px-5 rounded-e-full flex justify-center items-center gap-1 cursor-pointer hover:bg-[rgb(45,45,45)] ${picked === "disagree" ? "text-red-500" : null}`}>
                <ArrowBigDown/>
                <p>{downvoteCount}</p>
            </button>
        </div>
    </div>
  )
}

export default Votes
