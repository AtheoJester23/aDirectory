'use server'

import { auth } from "@/auth";
import { prevStateType } from "@/components/StartupForm";
import { parseServerActionResponse } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import { nanoid } from "nanoid";
import slugify from 'slugify'

export type updvoteType = {
    upvotes:{
        _key: string,
        id: string
    }[],
    downvotes: {
        _key: string,
        id: string
    }[]
}

export type commentType = {
    _key: string,
    author:{
        _type: string,
        _ref: string | null,
    }
    comment: string
}

export async function UpdatePitch(state: prevStateType, formValues: FormData,  pitch: string,  id: string){
    const session = await auth();
    
    if(!session){
        return parseServerActionResponse({
            error: "Not signed in",
            status: "ERROR"
        })
    }

    const {title, description, category, link} = Object.fromEntries(
        Array.from(formValues).filter(([key]) => key != 'pitch')
    )
    
    const slug =slugify(title as string, {lower: true})

    try {
        const startup = {
            title,
            description,
            category,
            image: link,
            slug: {
                _type: slug,
                current: slug,
            },
            author: {
                _type: 'reference',
                _ref: session?.id,
            },
            pitch,
        };

        const response = await client
            .patch(id)
            .set({...startup})
            .commit()
        
        return parseServerActionResponse({
            ...response,
            error: '',
            status: "SUCCESS"
        })
    } catch (error) {
        console.error('Update failed: ', error);
        return parseServerActionResponse({
            error: JSON.stringify(error),
            status: "ERROR"
        })
    }
}

export async function updateVote(id: string, vote: updvoteType){
    try {
        const response = await client
            .patch(id)
            .set({upvotes: vote.upvotes, downvotes: vote.downvotes})
            .commit();

        return{success:true};
    } catch (error) {
        console.error('Update Vote Failed',error);
        return {success: false, error: (error as Error).message}
    }
}

export async function removeVote(id: string, vote: string, choice: string){
    try {
        const response = await client
            .patch(id)
            .unset([`${choice}[id==\"${vote}\"]`])
            .commit();

        return {success:true}
    } catch (error) {
        console.error("Update Vote Failed: ", error);
        return {success: false, error: (error as Error).message}
    }
}

export async function addVote(id: string, vote: string, choice: string){
    try {
        const response = await client
            .patch(id)
            .setIfMissing({ [choice]: [] })
            .append(choice, [{_key: nanoid(), id: vote}])
            .commit();
    
        return {success: true}
    } catch (error) {
        console.error("Update Vote Failed: ", error);
        return {success: false, error: (error as Error).message}
    }
}

export const changeVote = async (id: string, voter: string, choice: string) => {
    
    try {
        if(choice == "upvotes"){
            const [add, rem]= await Promise.all([
                client.patch(id).setIfMissing({"upvotes": []}).append("upvotes", [{_key: nanoid(), id: voter}]).commit(),
                client.patch(id).unset([`downvotes[id=="${voter}"]`]).commit()
            ])
        }else if(choice == "downvotes"){
            const [add, rem]= await Promise.all([
                client.patch(id).setIfMissing({"downvotes": []}).append("downvotes", [{_key: nanoid(), id: voter}]).commit(),
                client.patch(id).unset([`upvotes[id=="${voter}"]`]).commit()
            ])
        }
    } catch (error) {
        console.error("Update Vote Failed: ", error)
        return {success: false, error: (error as Error).message}
    }
}

export async function addComment(id: string, comment: commentType){
    try {
        const response = await client
            .patch(id)
            .setIfMissing({comments: []})
            .append("comments", [comment])
            .commit()
        
        return {success: true}
    } catch (error) {
        console.error("Update Vote Failed: ", error)
        return {success: false, error: (error as Error).message}
    }
}