import React, { useState, useContext } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { UserContext } from '../../context/userContext'
import { useWorkspace } from '../../context/WorkspaceContext'
import uploadImage from '../../utils/uploadImage'
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu'

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [adminInviteToken, setAdminInviteToken] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const { updateUser } = useContext(UserContext)
  const { fetchWorkspaces } = useWorkspace()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const workspaceId = searchParams.get('workspaceId') || null

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setProfilePic(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    if (!fullName) { setError('Please enter full name'); return }
    if (!validateEmail(email)) { setError('Please enter a valid email address'); return }
    if (!password) { setError('Please enter the password'); return }
    setError('')
    setLoading(true)
    try {
      let profileImageUrl = ''
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic)
        profileImageUrl = imgUploadRes.imageUrl || ''
      }
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName, email, password, profileImageUrl, adminInviteToken, workspaceId,
      })
      const { token, role, workspaceId: returnedWorkspaceId } = response.data
      if (token) {
        localStorage.setItem('token', token)
        if (returnedWorkspaceId) localStorage.setItem('activeWorkspaceId', returnedWorkspaceId)
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
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #60a5fa 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/40">
            <span className="text-white text-base font-bold">T</span>
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">Task Manager</span>
        </div>

        <div className="relative">
          <p className="text-white/80 text-xl font-light leading-relaxed">
            {workspaceId
              ? "You've been invited to collaborate. Join your team and get started."
              : "Organize your work, your team, and your goals — all in one place."}
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mt-10">
            {['Task tracking', 'Team workspaces', 'Progress reports', 'Role management'].map(f => (
              <span key={f} className="text-xs text-blue-300 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                {f}
              </span>
            ))}
          </div>
        </div>

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

          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {workspaceId ? 'Join workspace' : 'Create your account'}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {workspaceId ? "You've been invited. Fill in your details to join." : 'Get started for free today.'}
          </p>

          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Avatar */}
            <div className="flex justify-center mb-2">
              <div className="relative">
                {previewUrl ? (
                  <>
                    <img src={previewUrl} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-blue-100" />
                    <button type="button" onClick={() => { setProfilePic(null); setPreviewUrl(null) }}
                      className="absolute -bottom-1 -right-1 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center shadow">
                      <LuTrash className="text-xs" />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <LuUser className="text-gray-400 text-2xl" />
                    </div>
                    <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center shadow cursor-pointer">
                      <LuUpload className="text-xs" />
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </>
                )}
              </div>
            </div>

            {[
              { label: 'Full Name', value: fullName, set: setFullName, ph: 'John Doe', type: 'text' },
              { label: 'Email Address', value: email, set: setEmail, ph: 'john@example.com', type: 'text' },
              { label: 'Password', value: password, set: setPassword, ph: 'Min 8 characters', type: 'password' },
            ].map(({ label, value, set, ph, type }) => (
              <div key={label}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                <input type={type} value={value} onChange={({ target }) => set(target.value)} placeholder={ph}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition bg-white" />
              </div>
            ))}

            {!workspaceId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Admin Invite Token <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input type="text" value={adminInviteToken} onChange={({ target }) => setAdminInviteToken(target.value)}
                  placeholder="6 digit code"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition bg-white" />
              </div>
            )}

            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                <p className="text-rose-600 text-xs">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-md shadow-blue-500/20 disabled:opacity-50">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:text-blue-700 transition">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp