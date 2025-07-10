"use client"

import { deletePitch } from '@/actions/deleteAction'
import { Pencil, Trash, TriangleAlert } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { Dialog } from '@headlessui/react'

function ActionButtons({id}: {id: string}) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const router = useRouter();
    
    const handleDelete = async () => {
        try {
            const response = await deletePitch(id);

            if(!response.success){
                throw new Error(response.error)
            }
            
            toast.success("Item Deleted Successfully",{
                description: "Your startup pitch has been deleted"
            })

            router.push('/');
        } catch (error) {
            console.error(error)
            toast.error("Failed To Delete Item", {
                description: "Your startup pitch wasn't deleted"
            })
        }finally{
            setIsOpen(false);
        }
    }

  return (
    <>
        <section className='flex flex-row items-center justify-center mt-5 gap-5'>
            <button className='bg-red-500 p-3 rounded-full -translate-y-1 hover:translate-none cursor-pointer duration-200' onClick={() => setIsOpen(true)}>
                <Trash className="size-7 text-white"/>
            </button>
            <button className='bg-blue-500 p-3 rounded-full -translate-y-1 hover:translate-none cursor-pointer duration-200' >
                <Pencil className="size-7 text-white"/>
            </button>
        </section>
        <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
            <div className='fixed inset-0 bg-black/30'></div>

            <div className='fixed inset-0 flex w-screen items-center justify-center p-4'>
                <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-5 max-sm:w-[90%] sm:w-[50%]">
                    <div className='flex justify-center flex-col items-center gap-3'>
                        <TriangleAlert size={100} className='text-red-500'/>
                        <div className='text-center'>
                            <Dialog.Title className="text-2xl font-bold">Are you sure?</Dialog.Title>
                            <Dialog.Description className="text-gray-500">Warning: This action cannot be undone.</Dialog.Description>
                        </div>
                        <div className='flex gap-3'>
                            <button 
                                className='px-5 py-2 bg-red-500 text-white rounded-full cursor-pointer hover:bg-red-600 duration-200 -translate-y-0.25 hover:translate-none shadow hover:shadow-none' 
                                onClick={() => handleDelete()}>
                                    Yes
                            </button>
                            <button className='px-5 py-2 bg-gray-500 text-white rounded-full cursor-pointer hover:bg-gray-600 duration-200 -translate-y-0.25 hover:translate-none shadow hover:shadow-none' onClick={() => setIsOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    </>
  )
}

export default ActionButtons
