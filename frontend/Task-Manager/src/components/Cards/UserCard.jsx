import React from 'react'
import { LuTrash2 } from 'react-icons/lu'

const UserCard = ({ userInfo, onDelete }) => {
  return (
    <div className='user-card p-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          {userInfo?.profileImageUrl ? (
            <div className='relative w-12 h-12 flex-shrink-0'>
              <img
                src={userInfo.profileImageUrl}
                alt={userInfo.name}
                className='w-12 h-12 rounded-full object-cover border-2 border-white'
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.querySelector('.fallback').style.display = 'flex';
                }}
              />
              <div
                className='fallback w-12 h-12 rounded-full bg-blue-100 items-center justify-center text-blue-600 font-semibold text-sm absolute top-0 left-0 border-2 border-white'
                style={{ display: 'none' }}
              >
                {userInfo.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          ) : (
            <div className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm border-2 border-white flex-shrink-0'>
              {userInfo?.name?.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <p className='text-sm font-medium text-gray-800'>{userInfo?.name}</p>
            <p className='text-xs text-gray-500'>{userInfo?.email}</p>
          </div>
        </div>

        {/* ✅ Delete button */}
        <button
          onClick={() => onDelete(userInfo._id)}
          className='flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer transition'
        >
          <LuTrash2 className='text-base' /> Delete
        </button>
      </div>

      <div className='flex items-end gap-3 mt-5'>
        <StatCard label="Pending" count={userInfo?.pendingTasks || 0} status="Pending" />
        <StatCard label="In Progress" count={userInfo?.inProgressTasks || 0} status="In Progress" />
        <StatCard label="Completed" count={userInfo?.completedTasks || 0} status="Completed" />
      </div>
    </div>
  )
}

export default UserCard

const StatCard = ({ label, count, status }) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress": return "text-cyan-500 bg-cyan-50";
      case "Completed": return "text-indigo-500 bg-indigo-50";
      default: return "text-violet-500 bg-violet-50";
    }
  };
  return (
    <div className={`flex-1 text-[10px] font-medium ${getStatusTagColor()} px-4 py-1.5 rounded-lg`}>
      <span className='text-[12px] font-semibold'>{count}</span> <br /> {label}
    </div>
  )
}