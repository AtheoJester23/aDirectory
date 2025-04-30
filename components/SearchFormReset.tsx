"use client"

import { X } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

function SearchFormReset() {
    const reset = () => {
        const form = document.querySelector('.search-form') as HTMLFormElement;

        if(form) form.reset();
    }

  return (
    <button type='reset' onClick={reset}>
        <Link href="/" className='search-btn text-white !important hover:border-2 hover:border-red-500 duration-50'>
            <X className='size-5 hover:text-red-500 hover:border-red-500 duration-200'/>
        </Link>
    </button>
  )
}

export default SearchFormReset
