import React, { useEffect, useState } from 'react'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useNavigate } from 'react-router-dom';
import { LuFileSpreadsheet } from 'react-icons/lu';
import TaskStatusTabs from '../../components/layouts/TaskStatusTabs';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import TaskCard from '../../components/Cards/TaskCard';
import toast from 'react-hot-toast';

const ManageTask = () => {

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

  const handleClick = (taskData) => {
    navigate('/admin/create-task', { state: { taskId: taskData._id } });
  }

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
        responseType: "blob",
      });

      //Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "task_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading expense details:", error);
      toast.error("Failed to download expense details. Please try again.");
    }
  };

  useEffect(() => {
    getAllTasks(filterStatus);
    return () => { };
  }, [filterStatus]);
  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className='my-5'>
        <div className='flex flex-col lg:flex-row lg:items-center justify-between'>

          <div className='flex items-center justify-between gap-3'>
            <h2 className='text-xl md:text-xl font-medium text-slate-700'>My Tasks</h2>

            <button
              className='flex lg:hidden download-btn'
              onClick={handleDownloadReport}>

              <LuFileSpreadsheet className='text-lg' />
              Download Report
            </button>
          </div>

          {tabs?.[0]?.count > 0 && (
            <div className='flex items-center gap-3'>
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />

              <button className='hidden lg:flex download-btn' onClick={handleDownloadReport}>
                <LuFileSpreadsheet className='text-lg' />
                Download Report
              </button>
            </div>
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
                assignedTo={item.assignedTo || []}
                attachmentCount={item.attachments?.length || 0}
                completedTodoCount={item.completedTodoCount}
                todoChecklist={item.todoChecklist || []}
                onClick={() => handleClick(item)}
              />
            ))
          ) : (
            <div className='col-span-3 flex flex-col items-center justify-center py-20 text-center'>
              <div className='w-16 h-16 bg-violet-50 rounded-full flex items-center justify-center mb-4'>
                <LuFileSpreadsheet className='text-2xl text-violet-400' />
              </div>
              <h3 className='text-sm font-medium text-gray-700'>No Tasks Found</h3>
              <p className='text-xs text-gray-400 mt-1'>
                {filterStatus === "All"
                  ? "No tasks have been created yet."
                  : `No tasks with status "${filterStatus}".`}
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ManageTask
