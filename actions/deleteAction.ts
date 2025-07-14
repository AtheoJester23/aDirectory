'use server'

import { client } from "@/sanity/lib/client"

export async function deletePitch(id: string){
    try {
        await client.delete(id)
        return{success:true}
    } catch (error) {
        return {success: false, error: (error as Error).message}
    }
}

export async function deleteComment(id: string, userKey: string){
    try {
        const response = await client
            .patch(id)
            .unset([`comments[_key=="${userKey}"]`])
            .commit()
        return {success: true}
    } catch (error) {
        console.error(error)
        return {success: false, error: (error as Error).message}
    }
}