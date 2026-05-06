import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { UserContext } from '../../context/userContext'
import { useWorkspace } from '../../context/WorkspaceContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const { updateUser } = useContext(UserContext)
  const { fetchWorkspaces } = useWorkspace()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!validateEmail(email)) { setError('Please enter a valid email address'); return }
    if (!password) { setError('Please enter the password'); return }
    setError('')
    setLoading(true)
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password })
      const { token, role, workspaceId } = response.data
      if (token) {
        localStorage.setItem('token', token)
        if (workspaceId) localStorage.setItem('activeWorkspaceId', workspaceId)
        updateUser(response.data)
        await fetchWorkspaces()
        navigate(role === 'admin' ? '/admin/dashboard' : '/user/dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background dots */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #60a5fa 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/40">
            <span className="text-white text-base font-bold">T</span>
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">Task Manager</span>
        </div>

        {/* Center quote */}
        <div className="relative">
          <div className="text-5xl text-blue-400/30 font-serif leading-none mb-4">"</div>
          <p className="text-white/80 text-xl font-light leading-relaxed">
            The secret of getting ahead is getting started.
          </p>
          <p className="text-blue-400/70 text-sm mt-4 font-medium">— Mark Twain</p>

          {/* Stats row */}
          <div className="flex gap-8 mt-12">
            {[['10k+', 'Tasks completed'], ['500+', 'Teams worldwide'], ['99.9%', 'Uptime']].map(([val, label]) => (
              <div key={label}>
                <p className="text-white font-bold text-xl">{val}</p>
                <p className="text-slate-400 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <p className="relative text-slate-600 text-xs">© 2026 Task Manager. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#f8fafc]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">T</span>
            </div>
            <span className="font-semibold text-gray-800">Task Manager</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
          <p className="text-sm text-gray-500 mb-8">Sign in to your workspace to continue</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input
                type="text"
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                placeholder="john@example.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                placeholder="Min 8 characters"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition bg-white"
              />
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                <p className="text-rose-600 text-xs">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-md shadow-blue-500/20 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 font-medium hover:text-blue-700 transition">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login