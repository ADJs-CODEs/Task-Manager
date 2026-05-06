import React, { useState, useEffect } from 'react'
import { LuTrash2, LuX } from 'react-icons/lu'
import StickyNoteModal, { StickyNotePin } from './StickyNote'
import ReactDOM from 'react-dom'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { useWorkspace } from '../../context/WorkspaceContext'

const UserCard = ({ userInfo, onDelete }) => {
  const [noteOpen, setNoteOpen] = useState(false)
  const [savedNote, setSavedNote] = useState('')
  const [savedColor, setSavedColor] = useState('Yellow')
  const [imageExpanded, setImageExpanded] = useState(false)
  const { activeWorkspace } = useWorkspace()

  // ✅ Load note on mount so it persists after refresh
  useEffect(() => {
    if (!activeWorkspace?._id || !userInfo?._id) return
    const fetchNote = async () => {
      try {
        const res = await axiosInstance.get(
          API_PATHS.WORKSPACES.GET_MEMBER_NOTE(activeWorkspace._id, userInfo._id)
        )
        if (res.data.note) {
          setSavedNote(res.data.note)
          setSavedColor(res.data.color || 'Yellow')
        }
      } catch (err) {
        // no note yet, that's fine
      }
    }
    fetchNote()
  }, [activeWorkspace, userInfo._id])

  const handleNoteClose = (note, color) => {
    if (note !== null) {
      setSavedNote(note)
      setSavedColor(color)
    }
    setNoteOpen(false)
  }

  const avatarUrl = userInfo?.profileImageUrl
  const initials = userInfo?.name?.charAt(0).toUpperCase()

  return (
    <div className='user-card p-4 relative'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          {avatarUrl ? (
            <div className='relative w-12 h-12 flex-shrink-0'>
              <img
                src={avatarUrl}
                alt={userInfo.name}
                className='w-12 h-12 rounded-full object-cover border-2 border-white cursor-pointer hover:opacity-80 transition'
                onClick={() => setImageExpanded(true)}
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.parentNode.querySelector('.fallback').style.display = 'flex'
                }}
              />
              <div
                className='fallback w-12 h-12 rounded-full bg-blue-100 items-center justify-center text-blue-600 font-semibold text-sm absolute top-0 left-0 border-2 border-white cursor-pointer'
                style={{ display: 'none' }}
                onClick={() => setImageExpanded(true)}
              >
                {initials}
              </div>
            </div>
          ) : (
            <div
              className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm border-2 border-white flex-shrink-0 cursor-pointer hover:opacity-80 transition'
              onClick={() => setImageExpanded(true)}
            >
              {initials}
            </div>
          )}

          <div>
            <p className='text-sm font-medium text-gray-800'>{userInfo?.name}</p>
            <p className='text-xs text-gray-500'>{userInfo?.email}</p>
          </div>
        </div>

        <button
          onClick={() => onDelete(userInfo._id)}
          className='flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer transition'
        >
          <LuTrash2 className='text-base' /> Delete
        </button>
      </div>

      <StickyNotePin
        onClick={() => setNoteOpen(true)}
        note={savedNote}
        color={savedColor}
      />

      <div className='flex items-end gap-3 mt-3'>
        <StatCard label="Pending" count={userInfo?.pendingTasks || 0} status="Pending" />
        <StatCard label="In Progress" count={userInfo?.inProgressTasks || 0} status="In Progress" />
        <StatCard label="Completed" count={userInfo?.completedTasks || 0} status="Completed" />
      </div>

      <StickyNoteModal
        isOpen={noteOpen}
        onClose={handleNoteClose}
        userId={userInfo._id}
        userName={userInfo.name}
      />

      {imageExpanded && ReactDOM.createPortal(
        <div
          className='fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm'
          onClick={() => setImageExpanded(false)}
        >
          <div className='relative' onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setImageExpanded(false)}
              className='absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition z-10'
            >
              <LuX className='text-gray-700 text-sm' />
            </button>
            {avatarUrl ? (
              <img src={avatarUrl} alt={userInfo.name} className='w-64 h-64 rounded-2xl object-cover shadow-2xl' />
            ) : (
              <div className='w-64 h-64 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-7xl shadow-2xl'>
                {initials}
              </div>
            )}
            <p className='text-white text-center text-sm font-medium mt-3'>{userInfo?.name}</p>
            <p className='text-gray-400 text-center text-xs mt-0.5'>{userInfo?.email}</p>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

export default UserCard

const StatCard = ({ label, count, status }) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress": return "text-cyan-500 bg-cyan-50"
      case "Completed": return "text-indigo-500 bg-indigo-50"
      default: return "text-violet-500 bg-violet-50"
    }
  }
  return (
    <div className={`flex-1 text-[10px] font-medium ${getStatusTagColor()} px-4 py-1.5 rounded-lg`}>
      <span className='text-[12px] font-semibold'>{count}</span> <br /> {label}
    </div>
  )
}