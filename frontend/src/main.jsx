import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import Home from './pages/Home/Home.jsx'
import Login from './pages/Login/Login.jsx'
import SignUp from './pages/SignUp/SignUp.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      {
        path:'/',
        element: <Home/>
      },
      {
        path: '/login',
        element: <Login/>
      },
      {
        path: '/signup',
        element: <SignUp/>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
