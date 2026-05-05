import React, { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const WorkspaceContext = createContext();

const WorkspaceProvider = ({ children }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all workspaces the admin belongs to
  const fetchWorkspaces = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.WORKSPACES.GET_MY_WORKSPACES);
      const data = response.data;
      setWorkspaces(data);

      // Restore last active workspace from localStorage or default to first
      const savedId = localStorage.getItem("activeWorkspaceId");
      const saved = data.find((w) => w._id === savedId);
      const toActivate = saved || data[0] || null;
      setActiveWorkspace(toActivate);
      if (toActivate) localStorage.setItem("activeWorkspaceId", toActivate._id);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    } finally {
      setLoading(false);
    }
  };

  const switchWorkspace = (workspace) => {
    setActiveWorkspace(workspace);
    localStorage.setItem("activeWorkspaceId", workspace._id);
  };

  const addWorkspace = (workspace) => {
    setWorkspaces((prev) => [...prev, workspace]);
    switchWorkspace(workspace);
  };

  const removeWorkspace = (workspaceId) => {
    const updated = workspaces.filter((w) => w._id !== workspaceId);
    setWorkspaces(updated);
    if (activeWorkspace?._id === workspaceId) {
      const next = updated[0] || null;
      setActiveWorkspace(next);
      if (next) localStorage.setItem("activeWorkspaceId", next._id);
      else localStorage.removeItem("activeWorkspaceId");
    }
  };

  const clearWorkspaces = () => {
    setWorkspaces([]);
    setActiveWorkspace(null);
    localStorage.removeItem("activeWorkspaceId");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchWorkspaces();
    else setLoading(false);
  }, []);

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        activeWorkspace,
        loading,
        fetchWorkspaces,
        switchWorkspace,
        addWorkspace,
        removeWorkspace,
        clearWorkspaces,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext);

export default WorkspaceProvider;