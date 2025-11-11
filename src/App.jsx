import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import authService from './appwrite/auth.js';
import './App.css'
import { login, logout } from './store/authSlice.js';
import {Header, Footer} from './components'
import { Outlet } from 'react-router';

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if(userData) {
          dispatch(login({userData}))
        }
        else {
          dispatch(logout({userData}))
        }
      })
      .finally(() => setLoading(false))
  }, [])

  return loading ? 
    <div className='min-h-full min-w-full bg-gray-400 text-black text-4xl flex'>
      Loading
    </div>
    : 
    <div>
      <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
        <div className='w-full block'>
          <Header />
          <main>
            <Outlet/>
          </main>
          <Footer />
        </div>
      </div>
    </div>
}

export default App
