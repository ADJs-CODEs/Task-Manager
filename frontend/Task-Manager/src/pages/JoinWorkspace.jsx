import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { useWorkspace } from "../context/WorkspaceContext";
import toast from "react-hot-toast";

const JoinWorkspace = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchWorkspaces } = useWorkspace();
  const [status, setStatus] = useState("joining"); // joining | success | error

  useEffect(() => {
    const join = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setStatus("error");
        return;
      }
      try {
        await axiosInstance.post(API_PATHS.WORKSPACES.JOIN_WORKSPACE, {
          inviteToken: token,
        });
        await fetchWorkspaces();
        setStatus("success");
        toast.success("Joined workspace successfully!");
        setTimeout(() => navigate("/admin/dashboard"), 1500);
      } catch (error) {
        setStatus("error");
        toast.error(error.response?.data?.message || "Failed to join workspace");
      }
    };

    join();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-sm w-full">
        {status === "joining" && (
          <>
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Joining workspace...</h2>
            <p className="text-sm text-gray-400 mt-1">Please wait a moment</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4 text-green-500 text-2xl">
              ✓
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Workspace joined!</h2>
            <p className="text-sm text-gray-400 mt-1">Redirecting you to the dashboard...</p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4 text-rose-500 text-2xl">

            </div>
            <h2 className="text-lg font-semibold text-gray-800">Invalid invite link</h2>
            <p className="text-sm text-gray-400 mt-1">This invite may have expired or already been used.</p>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 text-sm text-blue-600 underline"
            >
              Go to login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default JoinWorkspace;