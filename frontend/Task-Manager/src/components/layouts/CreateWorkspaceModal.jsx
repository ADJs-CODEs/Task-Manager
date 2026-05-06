import React, { useState } from "react";
import ReactDOM from "react-dom";
import { HiOutlineX } from "react-icons/hi";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useWorkspace } from "../../context/WorkspaceContext";
import toast from "react-hot-toast";

const CreateWorkspaceModal = ({ isOpen, onClose }) => {
  const { addWorkspace } = useWorkspace();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return toast.error("Workspace name is required");
    setLoading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.WORKSPACES.CREATE_WORKSPACE, {
        name,
        description,
      });
      addWorkspace(response.data);
      toast.success(`"${response.data.name}" workspace created!`);
      setName("");
      setDescription("");
      onClose();
    } catch (error) {
      toast.error("Failed to create workspace");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <HiOutlineX className="text-xl" />
        </button>

        <h2 className="text-lg font-semibold text-gray-800 mb-1">Create Workspace</h2>
        <p className="text-xs text-gray-400 mb-6">
          A workspace is a clean slate — its own tasks and members.
        </p>

        <div className="mb-4">
          <label className="text-xs font-medium text-gray-600">Workspace Name</label>
          <input
            type="text"
            className="form-input mt-1"
            placeholder="e.g. Marketing Team"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="text-xs font-medium text-gray-600">
            Description{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            className="form-input mt-1"
            placeholder="What is this workspace for?"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Workspace"}
          </button>
        </div>
      </div>
    </div>,
    document.body // ← renders directly on body, escapes navbar
  );
};

export default CreateWorkspaceModal;