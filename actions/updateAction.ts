'use server'

import { auth } from "@/auth";
import { prevStateType } from "@/components/StartupForm";
import { parseServerActionResponse } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import slugify from 'slugify'

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