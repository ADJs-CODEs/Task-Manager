import React from 'react'

const Progress = ({ progress, status }) => {

  const getColor = () => {
    switch (status) {
      case "In Progress":
        return "bg-cyan-500";
      case "Completed":
        return "bg-indigo-500";
      default:
        return "bg-violet-500";
    }
  }

  return (
    <div className='w-full bg-gray-200 rounded-full h-2'>
      <div
        className={`${getColor()} h-2 rounded-full transition-all duration-300`}
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export default Progress