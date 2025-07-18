"use server"

import { auth } from "@/auth"
import { parseServerActionResponse } from "./utils";
import slugify from 'slugify'
import { writeClient } from "@/sanity/lib/write-client";
import { prevStateType } from "@/components/StartupForm";

export const createPitch = async(state: prevStateType, form: FormData, pitch: string) => {
    const session = await auth();

    if(!session){
        return parseServerActionResponse({
            error: "Not signed in",
            status: "ERROR"
        })
    }

    const {title, description, category, link} = Object.fromEntries(
        Array.from(form).filter(([key]) => key != 'pitch')
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

        const result = await writeClient.create({_type: "startup", ...startup})
    
        return parseServerActionResponse({
            ...result,
            error: '',
            status: "SUCCESS"
        })
    } catch (error) {
        console.error(error);

        return parseServerActionResponse({
            error: JSON.stringify(error),
            status: "ERROR"
        })
    }
}