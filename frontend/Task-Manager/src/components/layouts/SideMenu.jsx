import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from '../../utils/data';
import { LuPencil, LuX } from 'react-icons/lu';
import EditProfileModal from './EditProfileModal';
import { useTheme } from '../../context/ThemeContext';
import ReactDOM from 'react-dom';

const SideMenu = ({ activeMenu }) => {
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [imageExpanded, setImageExpanded] = useState(false);
  const { user, clearUser } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);
  const { isDarkMode } = useTheme();

  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    clearUser();
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      setSideMenuData(user?.role === 'admin' ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA)
    }
    return () => { };
  }, [user]);

  return (
    <div className={`w-64 h-[calc(100vh-57px)] sticky top-[57px] z-20 flex flex-col transition-colors duration-300
      ${isDarkMode
        ? "border-r border-white/6"
        : "bg-white border-r border-gray-200/50"
      }`}
      style={isDarkMode ? { background: 'linear-gradient(160deg, #0f172a 0%, #1e293b 100%)' } : {}}
    >
      {/* Profile Section */}
      <div className="flex flex-col items-center pt-8 pb-6 px-4 border-b border-white/10">
        <div className="relative">
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt="Profile"
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-white/20 cursor-pointer hover:opacity-80 transition"
              onClick={() => setImageExpanded(true)}
            />
          ) : (
            <div
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-2xl ring-2 ring-white/20 cursor-pointer hover:opacity-80 transition"
              onClick={() => setImageExpanded(true)}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <button
            onClick={() => setOpenEditProfile(true)}
            className="absolute -bottom-1.5 -right-1.5 bg-blue-500 text-white rounded-full p-1.5 shadow-lg hover:bg-blue-400 transition"
          >
            <LuPencil className="text-xs" />
          </button>
        </div>

        {user?.role === "admin" && (
          <div className="text-[10px] font-semibold text-blue-300 bg-blue-500/20 border border-blue-400/30 px-3 py-0.5 rounded-full mt-3">
            Admin
          </div>
        )}

        <h5 className={`font-semibold text-sm mt-2 tracking-tight ${isDarkMode ? "text-white" : "text-gray-800"}`}>
          {user?.name || ""}
        </h5>
        <p className="text-[11px] text-slate-400 mt-0.5">{user?.email || ""}</p>
      </div>

      {/* Menu Items */}
      <div className="flex-1 py-4 px-3 overflow-y-auto">
        {sideMenuData.map((item, index) => (
          <button
            key={`menu_${index}`}
            className={`w-full flex items-center gap-3 text-[13px] font-medium rounded-xl px-4 py-2.5 mb-1 cursor-pointer transition-all
              ${activeMenu === item.label
                ? isDarkMode
                  ? "text-white bg-white/15"
                  : "text-primary bg-blue-50 border-r-2 border-primary"
                : isDarkMode
                  ? "text-slate-400 hover:text-white hover:bg-white/8"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            onClick={() => handleClick(item.path)}
          >
            <item.icon className={`text-lg ${activeMenu === item.label
              ? isDarkMode ? "text-blue-400" : "text-primary"
              : isDarkMode ? "text-slate-500" : "text-gray-400"}`}
            />
            {item.label}
            {activeMenu === item.label && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
            )}
          </button>
        ))}
      </div>

      {/* Bottom gradient fade */}
      <div className="h-6 bg-gradient-to-t from-slate-900/50 to-transparent" />

      <EditProfileModal
        isOpen={openEditProfile}
        onClose={() => setOpenEditProfile(false)}
      />

      {/* Image expand modal */}
      {imageExpanded && ReactDOM.createPortal(
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setImageExpanded(false)}
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setImageExpanded(false)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition z-10"
            >
              <LuX className="text-gray-700 text-sm" />
            </button>

            {user?.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt="Profile"
                className="w-64 h-64 rounded-2xl object-cover shadow-2xl"
              />
            ) : (
              <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-7xl shadow-2xl">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}

            <p className="text-white text-center text-sm font-medium mt-3">
              {user?.name}
            </p>
            <p className="text-gray-400 text-center text-xs mt-0.5">
              {user?.email}
            </p>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default SideMenu;