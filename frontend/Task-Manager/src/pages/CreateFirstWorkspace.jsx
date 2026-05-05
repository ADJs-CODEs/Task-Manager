import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'
import { API_PATHS } from '../utils/apiPaths'
import { useWorkspace } from '../context/WorkspaceContext'
import toast from 'react-hot-toast'

const CreateFirstWorkspace = () => {
  const { addWorkspace } = useWorkspace()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    if (!name.trim()) return toast.error('Workspace name is required')
    setLoading(true)
    try {
      const response = await axiosInstance.post(API_PATHS.WORKSPACES.CREATE_WORKSPACE, {
        name,
        description,
      })
      addWorkspace(response.data)
      toast.success(`"${response.data.name}" created!`)
      navigate('/admin/dashboard')
    } catch (error) {
      toast.error('Failed to create workspace')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#f8fafc]'>
      <div className='bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-8'>

        {/* Header */}
        <div className='text-center mb-8'>
          <div className='w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4'>
            <span className='text-white text-2xl font-bold'>T</span>
          </div>
          <h1 className='text-xl font-semibold text-gray-800'>Create your first workspace</h1>
          <p className='text-sm text-gray-400 mt-1'>
            A workspace keeps your tasks and team organized in one place.
          </p>
        </div>

        {/* Form */}
        <div className='mb-4'>
          <label className='text-xs font-medium text-gray-600'>Workspace Name</label>
          <input type='text' className='form-input mt-1' placeholder='e.g. Marketing Team' value={name} onChange={(e) =>
            setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
        </div>

        <div className='mb-8'>
          <label className='text-xs font-medium text-gray-600'>
            Description{' '}
            <span className='text-gray-400 font-normal'>(optional)</span>
          </label>
          <textarea className='form-input mt-1' placeholder='What is this workspace for?' rows={3} value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button
          onClick={handleCreate}
          disabled={loading}
          className='w-full py-3 rounded-xl bg-primary text-white text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50'
        >
          {loading ? 'Creating...' : 'Create Workspace'}
        </button>
      </div>
    </div>
  )
}

export default CreateFirstWorkspace