import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Login } from './components/Login.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <h1> hola </h1>
  },
  {
    path: '/login',
    element: <Login />
  }
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
