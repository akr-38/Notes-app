import React, { useState } from 'react'
import Navbar from '../../components/navbar/Navbar'
import PasswordInput from '../../components/input/PasswordInput';
import { validateEmail } from '../../utils/helper';
import {Link, useNavigate} from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance';
import loadingUI from '../../assets/images/loading.svg'

function SignUp() {

    const [name, setName]= useState('');
    const [email, setEmail]= useState('');
    const [password, setPassword]= useState('');
    const [error, setError]= useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    
    const handleSignUp = async(e)=>{
        e.preventDefault();
        
        if(!name){
            setError('Please enter your name.');
            return 
        }

        if(!validateEmail(email)){
            setError('Please enter a valid email address.');
            return;
        }

        if(!password){
            setError('Please enter the password');
            return;
        }

        setError('')

        //signup api call
        setLoading(true);
        try {
            const response = await axiosInstance.post('/create-account', {
                fullName: name,
                email: email,
                password: password,
            });
            if(response.data?.error){
                setError(response.data.message)
                return
            }
            else if(response.data?.accessToken){
                localStorage.setItem('token', response.data.accessToken);
                navigate('/');
            }
        } catch (error) {
            if(error.response?.data?.message){
                setError(error.response.data.message)
            }
            else{
                setError('An Unexpected Error Occurred. Please try again.')
            }
        }finally{
            setLoading(true);
        }
    }
    
    return (
        <>
            <Navbar/>
            {loading ? (
                <div className='w-screen h-screen overflow-hidden text-center flex justify-center items-center font-bold text-6xl'>
                    <img src={loadingUI} alt="Loading" className='h-36'/>
                </div>
            ):(
                <div className='flex items-center justify-center mt-28'>
                <div className='w-96 border rounded bg-white px-7 py-10'>
                    <form onSubmit={handleSignUp}>
                        <h4 className='text-2xl mb-7'>Signup</h4>

                        <input 
                            type="text" 
                            placeholder='name' 
                            className='input-box'
                            value = {name}
                            onChange = {(e)=>{setName(e.target.value)}}
                        />

                        <input 
                            type="text" 
                            placeholder='email' 
                            className='input-box'
                            value = {email}
                            onChange = {(e)=>{setEmail(e.target.value)}}
                        />

                        <PasswordInput
                            value= {password}
                            onChange= {(e)=>{setPassword(e.target.value)}}
                        />

                        {error && (<p className='text-red-500 text-xs pb-1'>{error}</p>)}

                        <button type='submit' className='btn-primary'>Signup</button>

                        <p className='text-sm text-center mt-4'>
                            Already have an account?{' '}
                            <Link to='/login' className='font-medium text-primary underline'>
                                Login
                            </Link>
                        </p>
                    </form>
                </div>
                </div>
            )}
            
        </>
    )
}

export default SignUp
