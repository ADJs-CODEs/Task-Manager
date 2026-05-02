import React, { useEffect, useState } from 'react'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useNavigate } from 'react-router-dom';
import { LuFileSpreadsheet } from 'react-icons/lu';
import TaskStatusTabs from '../../components/layouts/TaskStatusTabs';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import TaskCard from '../../components/Cards/TaskCard';
import toast from 'react-hot-toast';

const MyTask = () => {

  const [allTasks, setAllTasks] = useState([]);

  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const navigate = useNavigate();
  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      });

      setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : []);
      //Map statusSummary data with fixed labels and order
      const statusSummary = response.data?.statusSummary || {};

      const statusArray = [
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pendingTasks || 0 },
        { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
        { label: "Completed", count: statusSummary.completedTasks || 0 },
      ];

      setTabs(statusArray);

    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const handleClick = (taskId) => {
    navigate(`/user/task-details/${taskId}`);
  }
  useEffect(() => {
    getAllTasks(filterStatus);
    return () => { };
  }, [filterStatus]);
  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className='my-5'>
        <div className='flex flex-col lg:flex-row lg:items-center justify-between'>
          <h2 className='text-xl md:text-xl font-medium'>My Tasks</h2>

          {tabs?.[0]?.count > 0 && (
            <TaskStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
            />
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
          {allTasks?.length > 0 ? (
            allTasks.map((item) => (
              <TaskCard
                key={item._id}
                title={item.title}
                description={item.description}
                priority={item.priority}
                status={item.status}
                progress={item.progress}
                createdAt={item.createdAt}
                dueDate={item.dueDate}
                assignedTo={item.assignedTo?.map((item) => item.profileImageUrl)}
                attachmentCount={item.attachments?.length || 0}
                completedTodoCount={item.completedTodoCount}
                todoChecklist={item.todoChecklist || []}
                onClick={() => handleClick(item._id)}
              />
            ))
          ) : (
            <div className='col-span-3 flex flex-col items-center justify-center py-20 text-center'>
              <div className='w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4'>
                <LuFileSpreadsheet className='text-2xl text-primary' />
              </div>
              <h3 className='text-sm font-medium text-gray-700'>No Tasks Found</h3>
              <p className='text-xs text-gray-400 mt-1'>
                {filterStatus === "All"
                  ? "You have no tasks assigned yet."
                  : `No tasks with status "${filterStatus}".`}
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default MyTask
