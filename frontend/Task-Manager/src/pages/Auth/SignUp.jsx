import React, { useState, useContext } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { validateEmail } from '../../utils/helper'
import AuthLayout from '../../components/layouts/AuthLayout'
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector'
import Input from '../../components/Inputs/Input'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { UserContext } from '../../context/userContext'
import { useWorkspace } from '../../context/WorkspaceContext'
import uploadImage from '../../utils/uploadImage'

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [adminInviteToken, setAdminInviteToken] = useState('')
  const [error, setError] = useState(null)

  const { updateUser } = useContext(UserContext)
  const { fetchWorkspaces } = useWorkspace()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Read workspaceId from invite link if present
  const workspaceId = searchParams.get('workspaceId') || null

  const handleSignUp = async (e) => {
    e.preventDefault()

    if (!fullName) { setError('Please enter full name'); return }
    if (!validateEmail(email)) { setError('Please enter a valid email address'); return }
    if (!password) { setError('Please enter the password'); return }
    setError('')

    try {
      let profileImageUrl = ''
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic)
        profileImageUrl = imgUploadRes.imageUrl || ''
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
        adminInviteToken,
        workspaceId, // pass workspace ID if coming from invite link
      })

      const { token, role, workspaceId: returnedWorkspaceId } = response.data

      if (token) {
        localStorage.setItem('token', token)

        // If they were added to a workspace, save it immediately
        if (returnedWorkspaceId) {
          localStorage.setItem('activeWorkspaceId', returnedWorkspaceId)
        }

        updateUser(response.data)
        await fetchWorkspaces()

        if (role === 'admin') {
          navigate('/admin/dashboard')
        } else {
          navigate('/user/dashboard')
        }
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError('Something went wrong. Please try again.')
      }
    }
  }

  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Create an Account</h3>
        <p className='text-xs text-slate-700 mt-1.25 mb-6'>
          {workspaceId
            ? "You've been invited! Fill in your details to join."
            : 'Join us today by entering your details below.'}
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="John"
              type="text"
            />
            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="john@example.com"
              type="text"
            />
            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              placeholder="Min 8 characters"
              type="password"
            />
            {/* Only show admin token field if not coming from a workspace invite */}
            {!workspaceId && (
              <Input
                value={adminInviteToken}
                onChange={({ target }) => setAdminInviteToken(target.value)}
                label="Admin Invite Token"
                placeholder="6 Digit Code"
                type="text"
              />
            )}
          </div>

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className='btn-primary'>
            SIGN UP
          </button>

          <p className='text-[13px] text-slate-800 mt-3'>
            Already have an account?{' '}
            <Link className="font-medium text-primary underline" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp