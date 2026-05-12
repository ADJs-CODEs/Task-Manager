import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet } from "react-icons/lu";
import UserCard from "../../components/Cards/UserCard";
import toast from "react-hot-toast";
import Modal from "../../components/layouts/Model";
import DeleteAlert from "../../components/layouts/DeleteAlert";

const ManageUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (response.data?.length > 0) {
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDeleteClick = (userId) => {
    setSelectedUserId(userId);
    setOpenDeleteAlert(true);
  };

  const handleDeleteUser = async () => {
    try {
      await axiosInstance.delete(API_PATHS.USERS.DELETE_USER(selectedUserId));
      setAllUsers((prev) => prev.filter((u) => u._id !== selectedUserId));
      setOpenDeleteAlert(false);
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user. Please try again.");
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_USERS, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "user_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download report. Please try again.");
    }
  };

  useEffect(() => {
    getAllUsers();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Team Members">
      <div className="mt-5 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-medium">Team Members</h2>
          <button
            className="flex items-center gap-2 download-btn w-fit"
            onClick={handleDownloadReport}
          >
            <LuFileSpreadsheet className="text-lg" />
            Download Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {allUsers?.map((user) => (
            <UserCard
              key={user._id}
              userInfo={user}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      </div>

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete User"
      >
        <DeleteAlert
          content="Are you sure you want to delete this user? This action cannot be undone."
          openDelete={handleDeleteUser}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default ManageUsers;
