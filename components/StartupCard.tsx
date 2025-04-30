import { formatDate } from '@/lib/utils';
import { EyeIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { Button } from './ui/button';
import { Startup, Author } from '@/sanity/types';

export type StartupTypeCard = Omit<Startup, "author"> & {author?: Author};

const StartupCard = ({prop}: {prop: StartupTypeCard}) => {
  const {_createdAt, views, author, title, _id, description, image, category} = prop

    return (
    <li className='startup-card shadow-xs'>
        <div className="flex-between">
            <p className='text-yellow-500'>{formatDate(_createdAt)}</p>
        
            <div className="flex gap-1 5">
                <EyeIcon className='size-6 text-primary'></EyeIcon>
                <span className='text-16-medium'>{views}</span>
            </div>
        </div>

        <div className="flex-between mt-5 gap5">
          <div className="flex-1">
            <Link href={`/user/${author?._id}`}>
              <p className="text-[16px] text-white font-bold line-clamp-1">
                {author?.name}
              </p>
            </Link>
            <Link href={`/startup/${_id}`}>
              <h3 className='text-[26px] text-semibold font-bold'>
                {title}
              </h3>
            </Link>
          </div>

          <Link href={`/user/${author?._id}`}>
            <Image src={author?.image!} alt={author?.name!} width={48} height={48} className='rounded-full'/>
          </Link>
        </div>

        <Link href={`/startup/${_id}`} className='block overflow-hidden group'>
        <p className="startup-card_desc text-white">
          {description}
        </p>
          <div className="overflow-hidden rounded-[10px]">
            <img
              src={image}
              alt="Image"
              className="transition-transform duration-500 hover:scale-105 startup-card_img"
            />
          </div>
        </Link>

        <div className="flex-between gap-3 mt-5">
          <Link href={`/?query=${category?.toLowerCase()}`}>
            <p className='text-[16px] font-medium bg-[rgb(29,185,84)] text-[rgb(10,10,10)] p-2 px-3 rounded-bl-xl rounded-tr-xl hover:-translate-y-0.5 duration-200 active:translate-none'>
              {category}
            </p>
          </Link>
          <Button className='startup-card_btn' asChild>
            <Link href={`/startup/${_id}`}>
              Details
            </Link>
          </Button>
        </div>
    </li>
  )
}

export default StartupCard
