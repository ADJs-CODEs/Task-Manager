import React, { useRef, useState, useEffect } from "react";
import { useWorkspace } from "../../context/WorkspaceContext";
import {
  LuChevronDown,
  LuPlus,
  LuCheck,
  LuTrash2,
  LuUsers,
} from "react-icons/lu";
import { useTheme } from "../../context/ThemeContext";
import CreateWorkspaceModal from "./CreateWorkspaceModal";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

const WorkspaceSwitcher = () => {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [showInvite, setShowInvite] = useState(false);
  const { workspaces, activeWorkspace, switchWorkspace, removeWorkspace } =
    useWorkspace();
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const dropdownRef = useRef(null);

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    try {
      await axiosInstance.post(
        API_PATHS.WORKSPACES.INVITE_TO_WORKSPACE(activeWorkspace._id),
        {
          email: inviteEmail,
          role: inviteRole,
        },
      );
      toast.success(`Invite sent to ${inviteEmail}`);
      setInviteEmail("");
      setShowInvite(false);
    } catch {
      toast.error("Failed to send invite");
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async (e, workspaceId) => {
    e.stopPropagation();
    try {
      await axiosInstance.delete(
        API_PATHS.WORKSPACES.DELETE_WORKSPACE(workspaceId),
      );
      removeWorkspace(workspaceId);
      toast.success("Workspace deleted");
    } catch (error) {
      toast.error("Failed to delete workspace");
    }
  };

  if (!activeWorkspace) return null;

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Trigger button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all
            ${
              isDarkMode
                ? "bg-white/10 border-white/10 text-white hover:bg-white/15"
                : "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200"
            }`}
        >
          {/* Workspace color dot */}
          <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
          <span className="hidden sm:inline max-w-[120px] truncate">
            {activeWorkspace.name}
          </span>{" "}
          <LuChevronDown
            className={`text-sm transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div
            className={`absolute top-full mt-2 left-0 w-64 rounded-xl border shadow-lg z-50 overflow-hidden
            ${
              isDarkMode
                ? "bg-[#1e293b] border-white/10"
                : "bg-white border-gray-200"
            }`}
          >
            <div
              className={`px-3 py-2 text-[10px] font-semibold uppercase tracking-wider
              ${isDarkMode ? "text-slate-500" : "text-gray-400"}`}
            >
              Your Workspaces
            </div>

            <div className="max-h-56 overflow-y-auto">
              {workspaces.map((workspace) => (
                <div
                  key={workspace._id}
                  onClick={() => {
                    switchWorkspace(workspace);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors group
                    ${
                      activeWorkspace._id === workspace._id
                        ? isDarkMode
                          ? "bg-blue-500/15"
                          : "bg-blue-50"
                        : isDarkMode
                          ? "hover:bg-white/5"
                          : "hover:bg-gray-50"
                    }`}
                >
                  {/* Workspace initial avatar */}
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {workspace.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate
                      ${isDarkMode ? "text-white" : "text-gray-800"}`}
                    >
                      {workspace.name}
                    </p>
                    {workspace.description && (
                      <p className="text-[11px] text-gray-400 truncate">
                        {workspace.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {activeWorkspace._id === workspace._id && (
                      <LuCheck className="text-blue-500 text-sm" />
                    )}
                    <button
                      onClick={(e) => handleDelete(e, workspace._id)}
                      className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-600 transition p-0.5"
                    >
                      <LuTrash2 className="text-sm" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Create new workspace */}
            <div
              className={`border-t ${isDarkMode ? "border-white/10" : "border-gray-100"}`}
            >
              <div
                className={`border-t ${isDarkMode ? "border-white/10" : "border-gray-100"}`}
              >
                {showInvite ? (
                  <div className="p-3 space-y-2">
                    <input
                      type="email"
                      placeholder="Email address"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
                    />
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowInvite(false)}
                        className="flex-1 text-xs py-1.5 rounded-lg border border-gray-200 text-gray-500"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleInvite}
                        className="flex-1 text-xs py-1.5 rounded-lg bg-blue-600 text-white font-medium"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setShowInvite(true);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors
        ${isDarkMode ? "text-green-400 hover:bg-white/5" : "text-green-600 hover:bg-green-50"}`}
                  >
                    <LuUsers className="text-base" />
                    Invite to Workspace
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowCreateModal(true);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors
                  ${
                    isDarkMode
                      ? "text-blue-400 hover:bg-white/5"
                      : "text-blue-600 hover:bg-blue-50"
                  }`}
              >
                <LuPlus className="text-base" />
                New Workspace
              </button>
            </div>
          </div>
        )}
      </div>

      <CreateWorkspaceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </>
  );
};

export default WorkspaceSwitcher;
