import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { UserContext } from '../context/userContext'
import { useWorkspace } from '../context/WorkspaceContext'

const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(UserContext)
  const { workspaces, loading: workspaceLoading } = useWorkspace()
  const token = localStorage.getItem('token')

  if (loading || workspaceLoading) return null
  if (!token || !user) return <Navigate to="/login" replace />
  if (!allowedRoles.includes(user.role)) return <Navigate to="/login" replace />

  // Admin with no workspace → force them to create one first
  if (user.role === 'admin' && workspaces.length === 0) {
    return <Navigate to="/create-first-workspace" replace />
  }

  return <Outlet />
}

export default PrivateRoute