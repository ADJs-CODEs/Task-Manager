import React, { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../../context/userContext';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { HiOutlineX } from 'react-icons/hi';
import { LuCamera } from 'react-icons/lu';
import toast from 'react-hot-toast';

const EditProfileModal = ({ isOpen, onClose }) => {
  const { user, updateUser } = useContext(UserContext);

  const [formData, setFormData] = useState({ name: '', email: '' });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Populate form when modal opens
  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '', email: user.email || '' });
      setPreviewUrl(user.profileImageUrl || null);
    }
  }, [user, isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file)); // instant preview before upload
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let profileImageUrl = user?.profileImageUrl;

      // Step 1: upload image to Cloudinary if a new one was selected
      if (imageFile) {
        const imageForm = new FormData();
        imageForm.append('image', imageFile);
        const uploadRes = await axiosInstance.post(
          API_PATHS.IMAGE.UPLOAD_IMAGE,
          imageForm,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        profileImageUrl = uploadRes.data.imageUrl || uploadRes.data.url;
      }

      // Step 2: update user profile with new name/email/image URL
      const response = await axiosInstance.put(
        API_PATHS.USERS.UPDATE_USER(user._id),
        { ...formData, profileImageUrl }
      );

      // Step 3: update context so sidebar refreshes instantly
      updateUser(response.data);
      toast.success('Profile updated!');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 relative">

        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <HiOutlineX className="text-xl" />
        </button>

        <h2 className="text-lg font-semibold text-gray-800 mb-6">Edit Profile</h2>

        {/* Avatar upload */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            {previewUrl ? (
              <img src={previewUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-gray-100" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl border-4 border-gray-100">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <button
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1.5 shadow hover:bg-blue-700 transition"
            >
              <LuCamera className="text-sm" />
            </button>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
          <p className="text-xs text-gray-400 mt-2">Click the camera icon to change photo</p>
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="text-xs font-medium text-gray-600">Name</label>
          <input
            type="text"
            className="form-input mt-1"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        {/* Email */}
        <div className="mb-6">
          <label className="text-xs font-medium text-gray-600">Email</label>
          <input
            type="email"
            className="form-input mt-1"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;