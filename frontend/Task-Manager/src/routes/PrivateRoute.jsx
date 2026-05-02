import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { UserContext } from '../context/userContext'

const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(UserContext)
  const token = localStorage.getItem('token')

  if (loading) return null
  if (!token || !user) return <Navigate to="/login" replace />
  if (!allowedRoles.includes(user.role)) return <Navigate to="/login" replace />

  return <Outlet />
}

export default PrivateRoute
