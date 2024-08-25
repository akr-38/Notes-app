import React, { useState } from 'react'
import ProfileInfo from '../cards/ProfileInfo'
import {useNavigate} from 'react-router-dom'
import SearchBar from '../searchBar/SearchBar';

function Navbar({userInfo, onSearchNote, getAllNotes, setIsSearch}) {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () =>{
        if(searchQuery){
            onSearchNote(searchQuery);
        }
    }
 
    const onClearSearch = () =>{
        setSearchQuery('');
        getAllNotes();
        setIsSearch(false); 
    }

    const onLogout = () =>{
        localStorage.clear();
        navigate('/login');
    }
    
    return (
        <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow'>
            <h2 className='text-xl font-medium text-black py-2'>Notes</h2>

            {userInfo && <SearchBar
                value={searchQuery}
                onChange={(e)=>{
                    setSearchQuery(e.target.value);
                }}
                handleSearch={handleSearch}
                onClearSearch={onClearSearch}
            />}

            <ProfileInfo userInfo={userInfo} onLogout={onLogout}/>
        </div>
    )
}

export default Navbar
