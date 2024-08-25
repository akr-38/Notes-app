import React from 'react'
import {FaMagnifyingGlass} from 'react-icons/fa6';
import {IoMdClose} from 'react-icons/io'

function SearchBar({value, onChange, handleSearch, onClearSearch}) {
    
    const handleKeyDown = (e) =>{
        if(e.key === 'Enter'){
            handleSearch();
        }
    }
    
    return (
        <div className='w-80 flex items-center px-4 bg-slate-200 rounded-md'>
            <input 
                type="text"
                value={value}
                placeholder='Search Notes'
                onChange={onChange}
                onKeyDown={(e)=>handleKeyDown(e)}
                className='w-full text-xs bg-transparent py-[11px] outline-none placeholder:text-slate-600'
            />

            {value && <IoMdClose onClick={onClearSearch} className='text-xl text-slate-500 cursor-pointer hover:text-black mr-3'/>}

            <FaMagnifyingGlass onClick={handleSearch} className='text-slate-500 cursor-pointer hover:text-black'/>
        </div>
    )
}

export default SearchBar
