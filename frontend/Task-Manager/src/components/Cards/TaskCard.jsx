import React from 'react'
import Progress from '../layouts/Progress';
import AvatarGroup from "../layouts/AvatarGroup";
import { LuPaperclip } from 'react-icons/lu';
import moment from "moment"
import { useTheme } from '../../context/ThemeContext';

const TaskCard = ({
  title,
  description,
  priority,
  status,
  progress,
  createdAt,
  dueDate,
  assignedTo,
  attachmentCount,
  completedTodoCount,
  todoChecklist,
  onClick
}) => {

  const { isDarkMode } = useTheme();

  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
      case "Completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/20";
      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10"
    }
  };

  const getPriorityTagColor = () => {
    switch (priority) {
      case "Low":
        return "text-emerald-500 bg-emerald-50 border border-emerald-500/10";
      case "Medium":
        return "text-amber-500 bg-amber-50 border-amber-500/10";
      default:
        return "text-rose-500 bg-rose-50 border border-rose-500/10";
    }
  };

  return (
    <div
      className={`rounded-xl py-4 shadow-md cursor-pointer transition-colors duration-300 border
       bg-[#f8fafc] border-gray-200/50 shadow-gray-100`}
      onClick={onClick}
    >
      <div className='flex items-end gap-3 px-4'>
        <div className={`text-[11px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded`}>
          {status}
        </div>
        <div className={`text-[11px] font-medium ${getPriorityTagColor()} px-4 py-0.5 rounded`}>
          {priority} Priority
        </div>
      </div>

      <div className={`px-4 border-l-[3px] ${status === "In Progress"
        ? "border-cyan-500"
        : status === "Completed"
          ? "border-indigo-500"
          : "border-violet-500"
        }`}>
        <p className={`text-sm font-medium mt-4 line-clamp-2 ${isDarkMode ? "text-slate-700" : "text-gray-600"}`}>
          {title}
        </p>
        <p className={`text-xs mt-1.5 line-clamp-2 leading-4.5 ${isDarkMode ? "text-slate-500" : "text-gray-500"}`}>
          {description}
        </p>
        <p className={`text-[13px] font-medium mt-2 mb-2 leading-4.5 ${isDarkMode ? "text-slate-600" : "text-gray-700/80"}`}>
          Task Done:{" "}
          <span className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-700"}`}>
            {completedTodoCount}/{todoChecklist.length || 0}
          </span>
        </p>
        <Progress progress={progress} status={status} />
      </div>

      <div className='px-4'>
        <div className='flex items-center justify-between my-1'>
          <div>
            <label className={`text-xs ${isDarkMode ? "text-slate-500" : "text-gray-500"}`}>Start Date</label>
            <p className={`text-[13px] font-medium ${isDarkMode ? "text-slate-800" : "text-gray-900"}`}>
              {moment(createdAt).format("Do MMM YYYY")}
            </p>
          </div>
          <div>
            <label className={`text-xs ${isDarkMode ? "text-slate-500" : "text-gray-500"}`}>Due Date</label>
            <p className={`text-[13px] font-medium ${isDarkMode ? "text-slate-800" : "text-gray-900"}`}>
              {moment(dueDate).format("Do MMM YYYY")}
            </p>
          </div>
        </div>

        <div className='flex items-center justify-between mt-3'>
          <AvatarGroup avatars={assignedTo || []} />
          {attachmentCount > 0 && (
            <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg ${isDarkMode ? "bg-blue-500/10" : "bg-blue-50"}`}>
              <LuPaperclip size={14} className="text-primary" />
              <span className={`text-xs ${isDarkMode ? "text-slate-700" : "text-gray-900"}`}>
                {attachmentCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskCard