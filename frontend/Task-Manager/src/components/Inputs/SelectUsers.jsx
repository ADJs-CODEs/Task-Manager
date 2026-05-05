import React, { useEffect, useState } from 'react'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { LuUsers, LuMail } from 'react-icons/lu'
import Modal from '../layouts/Model'
import AvatarGroup from '../layouts/AvatarGroup'
import toast from 'react-hot-toast'
import { useWorkspace } from '../../context/WorkspaceContext'

const SelectUsers = ({ selectedUsers, setSelectedUsers }) => {
  const { activeWorkspace } = useWorkspace()
  const [allUsers, setAllUsers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tempSelectedUsers, setTempSelectedUsers] = useState([])
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteLoading, setInviteLoading] = useState(false)

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS)
      if (response.data?.length > 0) {
        setAllUsers(response.data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    )
  }

  const handleAssign = () => {
    setSelectedUsers(tempSelectedUsers)
    setIsModalOpen(false)
  }

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return
    if (!activeWorkspace) return toast.error('No active workspace')
    setInviteLoading(true)
    try {
      await axiosInstance.post(
        API_PATHS.WORKSPACES.INVITE_TO_WORKSPACE(activeWorkspace._id),
        { email: inviteEmail }
      )
      toast.success(`Invite sent to ${inviteEmail}!`)
      setInviteEmail('')
    } catch (error) {
      toast.error('Failed to send invite. Please try again.')
    } finally {
      setInviteLoading(false)
    }
  }

  const selectedUserAvatars = allUsers
    .filter((user) => selectedUsers.includes(user._id))
    .map((user) => user.profileImageUrl)

  useEffect(() => {
    getAllUsers()
  }, [activeWorkspace])

  useEffect(() => {
    if (selectedUsers.length === 0) setTempSelectedUsers([])
  }, [selectedUsers])

  return (
    <div className='space-y-4 mt-2'>
      {selectedUserAvatars.length === 0 && (
        <button className='card-btn' onClick={() => setIsModalOpen(true)}>
          <LuUsers className="text-sm" /> Add Members
        </button>
      )}

      {selectedUserAvatars.length > 0 && (
        <div className='cursor-pointer' onClick={() => setIsModalOpen(true)}>
          <AvatarGroup avatars={selectedUserAvatars} maxVisible={3} />
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Select Users">
        {/* Invite by email */}
        <div className='flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100'>
          <LuMail className='text-blue-500 text-lg flex-shrink-0' />
          <input
            type="email"
            placeholder="Invite member by email..."
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className='flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400'
            onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
          />
          <button
            onClick={handleInvite}
            disabled={inviteLoading || !inviteEmail.trim()}
            className='text-xs font-medium bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50'
          >
            {inviteLoading ? 'Sending...' : 'Invite'}
          </button>
        </div>

        {/* Users list */}
        <div className='space-y-4 h-[60vh] overflow-y-auto'>
          {allUsers.length === 0 ? (
            <div className='text-center py-10 text-gray-400 text-sm'>
              No members in this workspace yet. Invite someone above!
            </div>
          ) : (
            allUsers.map((user) => (
              <div key={user._id} className='flex items-center gap-4 p-3 border-b border-gray-200'>
                {user.profileImageUrl ? (
                  <div className='relative w-10 h-10 flex-shrink-0'>
                    <img
                      src={user.profileImageUrl}
                      alt={user.name}
                      className='w-10 h-10 rounded-full object-cover'
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.parentNode.querySelector('.fallback-avatar').style.display = 'flex'
                      }}
                    />
                    <div
                      className='fallback-avatar w-10 h-10 rounded-full bg-blue-100 items-center justify-center text-blue-600 font-semibold text-sm absolute top-0 left-0'
                      style={{ display: 'none' }}
                    >
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                ) : (
                  <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0'>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className='flex-1'>
                  <p className='font-medium text-gray-800'>{user.name}</p>
                  <p className='text-[13px] text-gray-500'>{user.email}</p>
                </div>

                <input
                  type="checkbox"
                  checked={tempSelectedUsers.includes(user._id)}
                  onChange={() => toggleUserSelection(user._id)}
                  className='w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none'
                />
              </div>
            ))
          )}
        </div>

        <div className='flex justify-end gap-4 pt-4'>
          <button className='card-btn' onClick={() => setIsModalOpen(false)}>CANCEL</button>
          <button className='card-btn-fill' onClick={handleAssign}>DONE</button>
        </div>
      </Modal>
    </div>
  )
}

export default SelectUsers