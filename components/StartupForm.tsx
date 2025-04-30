"use client"

import React, { useActionState, useState } from 'react'
import { Textarea } from './ui/textarea';

import MDEditor from '@uiw/react-md-editor';
import { Send } from 'lucide-react';
import { formSchema } from '@/lib/validation';
import { Button } from './ui/button';
import { z } from 'zod'
import { toast } from 'sonner';
import { createPitch } from '@/lib/actions';
import { useRouter } from 'next/navigation';

const StartupForm = () => {
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [pitch, setPitch] = useState("");
  
  const router = useRouter()

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        pitch,
      }

      await formSchema.parseAsync(formValues);

      console.log(formValues);

      toast.success("Upload Successful",{
        description: "Your startup pitch has been uploaded"
      })

      const result = await createPitch(prevState, formData, pitch);

      router.push(`/startup/${result._id}`)
    } catch (error) {
      if(error instanceof z.ZodError){
        const fieldErrors = error.flatten().fieldErrors;

        setErrors(fieldErrors as unknown as Record<string, string>);
      
        toast.error("Error",{
          description: "Please check your inputs and try again..."
        })

        return {...prevState, error: "Validation failed", status: "ERROR" }
      }

      toast.error("Error",{
        description: "Unexpected error has occured"
      })

      return {...prevState, error: "Validation failed", status: "ERROR" }
    }
  }

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });

  return (
  <form action={formAction} className='startup-form'>
    <div className='flex flex-col'>
        <label htmlFor="title" className='startup-form_label'>Title</label>
        <input 
          id="title" 
          name='title'
          className="startup-form_input"
          required
          placeholder='Startup Title'
        />

        {errors.title && <p className='startup-form_error'>{errors.title}</p>}
    </div>

    <div className='flex flex-col'>
        <label htmlFor="description" className='startup-form_label'>Description</label>
        <Textarea
          id="description" 
          name='description'
          className="startup-form_textarea"
          required
          placeholder='Startup Description'
        />

        {errors.description && <p className='startup-form_error'>{errors.description}</p>}
    </div>

    <div className='flex flex-col'>
        <label htmlFor="category" className='startup-form_label'>Category</label>
        <input 
          id="category" 
          name='category'
          className="startup-form_input"
          required
          placeholder='Startup Category(Tech, Health, Education, etc...)'
        />

        {errors.category && <p className='startup-form_error'>{errors.category}</p>}
    </div>

    <div className='flex flex-col'>
        <label htmlFor="link" className='startup-form_label'>Image URL</label>
        <input 
          id="link" 
          name='link'
          className="startup-form_input"
          required
          placeholder='Startup Image URL'
        />

        {errors.link && <p className='startup-form_error'>{errors.link}</p>}
    </div>

    <div data-color-mode="light">
        <label htmlFor="pitch" className='startup-form_label'>Pitch</label>
        
        <MDEditor
          value={pitch}
          onChange={(value) => setPitch(value as string)}
          id="pitch"
          preview='edit'
          height={300}
          style={{borderRadius:20, overflow:"hidden", padding: "15px", margin: "10px 0px 0px"}}
          textareaProps={{
            placeholder:
              "Briefly describe your idea and what problem it solves..."
          }}
        />

        {errors.pitch && <p className='startup-form_error'>{errors.pitch}</p>}
    </div>

    <Button type='submit' className='startup-form_btn hover:cursor-pointer hover:text-white -translate-y-1 hover:translate-none duration-200 shadow-xl hover:shadow-none' disabled={isPending}>
      {isPending ? "Submitting..." : "Submit your pitch"}
    </Button>
  </form>)
}

export default StartupForm
