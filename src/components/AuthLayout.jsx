import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function AuthLayout({ children, authentication = true }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const authStatus = useSelector(state => state.auth.status)

  useEffect(() => {
    // needs auth but not logged in -> go login
    if (authentication && !authStatus) {
      navigate('/login')
    }
    // does NOT need auth (login/signup) but already logged in -> go home
    else if (!authentication && authStatus) {
      navigate('/')
    }
    setLoading(false)
  }, [authentication, authStatus, navigate])

  if (loading) return <h1>Loading...</h1>
  return <>{children}</>
}