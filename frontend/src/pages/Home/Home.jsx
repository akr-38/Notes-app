import React, { useEffect, useState } from 'react'
import Navbar from '../../components/navbar/Navbar'
import NoteCard from '../../components/cards/NoteCard'
import {MdAdd} from 'react-icons/md'
import AddEditNotes from './AddEditNotes'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom'
import axiosInstance from "../../utils/axiosInstance"
import Toast from '../../components/toastMessage/Toast'
import EmptyCard from '../../components/EmptyCard/EmptyCard'
import notepadNote from '../../assets/images/notepad-note.svg'
import noNotes from '../../assets/images/no-notes.svg'
import loadingUI from '../../assets/images/loading.svg'

function Home() {
    
    const [loading, setLoading] = useState(false);

    const [openAddEditModal, setOpenAddEditModal] = useState({
        isShown: false,
        type: 'add',
        data: null
    })

    const [ToastMessage, setToastMessage] = useState({
        isShown: false,
        type: 'add',
        message: ''
    })

    const [userInfo, setUserinfo] = useState(null);

    const [allNotes, setAllNotes] = useState([]);

    const [isSearch, setIsSearch] = useState(false);

    const navigate = useNavigate();

    const getUserInfo = async()=>{
        try {
            const response = await axiosInstance.get('/get-user');
            if(response.data?.user){
                setUserinfo(response.data.user);
            }
        } catch (error) {
            if(error.response.status === 401){
                localStorage.clear();
                navigate('/login');
            }
        }
    }

    const getAllNotes = async()=>{
        setLoading(true);
        try{
            const response = await axiosInstance.get('/get-all-notes');
            
            if(response.data?.notes){
                setAllNotes(response.data.notes);
            }
        }
        catch(error){
            console.log("An unexpected error occurred. Please try again.")
        }
        finally{
            setLoading(false);
        }
    }

    const deleteNote = async(data)=>{
        const noteId = data._id
        setLoading(true);
        try {
            const response = await axiosInstance.delete(`/delete-note/${noteId}`)
            if(!response.data?.error){
                
                await getAllNotes()
                showToastMessage('Note Deleted Successfully','delete')
            }
        } catch (error) {
            if(error.response?.data?.message){
                console.log("An unexpected error occurred. Please try again.")
            }
        }finally{
            setLoading(false);
        }
    }

    const onSearchNote = async(query)=>{
        setLoading(true)
        try{
            const response = await axiosInstance.get('/search-notes',{
                params: { query }
            });

            if(response.data?.notes){
                setIsSearch(true);
                setAllNotes(response.data.notes)
            }
        }catch(error){
            console.log(error);
        }finally{
            setLoading(false);
        }
    }

    const updateIsPinned = async(isPinned, noteId)=>{
        setLoading(true);
        try {
            const response = await axiosInstance.put(`/update-note-pinned/${noteId}`,{
                isPinned: (!isPinned)
            })
            if(response.data?.note){
                
                await getAllNotes()
                showToastMessage('Note Updated Successfully')
            }
        } catch (error) {
            if(error.response?.data?.message){
                setError(error.response.data.message)
            }
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        getAllNotes();
        getUserInfo();
        return ()=>{};
    },[])

    const handleEdit = (noteDetails) =>{
        setOpenAddEditModal({ isShown: true, type: 'edit', data: noteDetails })
    }

    const showToastMessage = (message, type='default')=>{
        setToastMessage({ isShown: true, message:message, type:type })
    }

    const handleToastClose = () => {
        setToastMessage({ isShown: false, type: 'add', message: '' })
    }

    

    
 
    return (
            <>
            <Navbar userInfo={userInfo} onSearchNote={onSearchNote} getAllNotes={getAllNotes} setIsSearch={setIsSearch}/>
            {loading? (
                <div className='w-screen h-screen overflow-hidden text-center flex justify-center items-center font-bold text-6xl'>
                    <img src={loadingUI} alt="Loading" className='h-36'/>
                </div>
            ) : (
                <div className='container px-5 mx-auto'>
                    { allNotes.length === 0 ? ( isSearch === true ? 
                        <EmptyCard
                            imgSrc={noNotes} 
                            message='No Such Notes Found!'
                            className='w-80'
                        />
                        :
                        <EmptyCard 
                            imgSrc={notepadNote} 
                            message="Start creating your first note! Click the 'Add' button to jot down your thoughs, ideas, and reminders. Let's get started!"
                            className='opacity-40 w-60'
                        />  
                    ) 
                        
                    : 
                        <div className='grid grid-cols-3 gap-4 mt-8'>
                            { allNotes.map((item)=>(
                                <NoteCard 
                                    key={item._id}
                                    title={item.title}
                                    date={item.createdOn}
                                    content={item.content}
                                    tags={item.tags}
                                    isPinned={item.isPinned}
                                    onEdit={()=>(handleEdit(item))}
                                    onDelete={()=>(deleteNote(item))}
                                    onPinNote={()=>(updateIsPinned(item.isPinned, item._id))}
                                />
                            ))}
                        </div>
                    }
                    
                </div>
            )}

            <button className='w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10' onClick={()=>{ setOpenAddEditModal({isShown:true, type:'add', data:null}) }}>
                <MdAdd className='text-[32px] text-white'/>
            </button>

            <Modal
                isOpen={openAddEditModal.isShown}
                onRequestClose={()=>{}}
                style={{
                    overlay:{
                        backgroundColor: "rgb(0,0,0,0.2)",
                    },
                }}
                contentLabel=''
                className='w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-auto'
            >
                <AddEditNotes
                    noteData={openAddEditModal.data}
                    type={openAddEditModal.type}
                    onClose={()=>{setOpenAddEditModal({ isShown:false, type:'add', data:null })}}
                    getAllNotes={getAllNotes}
                    showToastMessage={showToastMessage}
                    setLoading={setLoading}
                />
            </Modal>
            
            <Toast
                isShown={ToastMessage.isShown}
                message={ToastMessage.message}
                type={ToastMessage.type}
                onClose={handleToastClose}
            />
            </>
        )
}

export default Home
