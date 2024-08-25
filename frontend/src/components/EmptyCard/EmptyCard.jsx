import React from 'react'

function EmptyCard({imgSrc, message, className='opacity-100'}) {
    return (
        <div className='flex flex-col items-center justify-center mt-20'>
            <img className={`${className}`} src={imgSrc} alt="No Notes" />

            <p className='w-1/2 text-sm font-medium text-slate-500 text-center leading-7 mt-5'>{message}</p>
        </div>
    )
}

export default EmptyCard
